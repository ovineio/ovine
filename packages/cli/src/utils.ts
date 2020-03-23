import { createHash } from 'crypto'
import escapeStringRegexp from 'escape-string-regexp'
import fs from 'fs-extra'
import _ from 'lodash'
import path from 'path'
import webpack, { Configuration } from 'webpack'
import merge from 'webpack-merge'

import { libRootPath, libName } from './constants'

const fileHash = new Map()
export async function generate(
  generatedFilesDir: string,
  file: string,
  content: any,
  skipCache: boolean = process.env.NODE_ENV === 'production'
): Promise<void> {
  const filePath = path.join(generatedFilesDir, file)

  if (skipCache) {
    await fs.ensureDir(path.dirname(filePath))
    await fs.writeFile(filePath, content)
    return
  }

  let lastHash = fileHash.get(filePath)

  // If file already exists but its not in runtime cache yet,
  // we try to calculate the content hash and then compare
  // This is to avoid unnecessary overwriting and we can reuse old file.
  if (!lastHash && fs.existsSync(filePath)) {
    const lastContent = await fs.readFile(filePath, 'utf8')
    lastHash = createHash('md5')
      .update(lastContent)
      .digest('hex')
    fileHash.set(filePath, lastHash)
  }

  const currentHash = createHash('md5')
    .update(content)
    .digest('hex')

  if (lastHash !== currentHash) {
    await fs.ensureDir(path.dirname(filePath))
    await fs.writeFile(filePath, content)
    fileHash.set(filePath, currentHash)
  }
}

export function objectWithKeySorted(obj: object) {
  // https://github.com/lodash/lodash/issues/1459#issuecomment-253969771
  return _(obj)
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value()
}

const indexRE = /(^|.*\/)index\.(js|jsx|ts|tsx)$/i
const extRE = /\.(md|js)$/

/**
 * Convert filepath to url path.
 * Example: 'index.md' -> '/', 'foo/bar.js' -> '/foo/bar',
 */
export function fileToPath(file: string): string {
  if (indexRE.test(file)) {
    return file.replace(indexRE, '/$1')
  }
  return `/${file.replace(extRE, '').replace(/\\/g, '/')}`
}

export function encodePath(userPath: string): string {
  return userPath
    .split('/')
    .map((item) => encodeURIComponent(item))
    .join('/')
}

/**
 * Given an input string, convert to kebab-case and append a hash.
 * Avoid str collision.
 */
export function genFileHash(str: string): string {
  if (str === '/') {
    return 'index'
  }
  const shortHash = createHash('md5')
    .update(str)
    .digest('hex')
    .substr(0, 3)
  return `${_.snakeCase(str)}_${shortHash}`
}

/**
 * Convert Windows backslash paths to posix style paths.
 * E.g: endi\\lie -> endi/lie
 */
export function posixPath(str: string): string {
  const isExtendedLengthPath = /^\\\\\?\\/.test(str)
  const hasNonAscii = /[^\u0000-\u0080]+/.test(str) // eslint-disable-line

  if (isExtendedLengthPath || hasNonAscii) {
    return str
  }
  return str.replace(/\\/g, '/')
}

export function idx(target: any, keyPaths?: string | Array<string | number>): any {
  return (
    target &&
    keyPaths &&
    (Array.isArray(keyPaths)
      ? keyPaths.reduce((obj, key) => obj && obj[key], target)
      : target[keyPaths])
  )
}

/**
 * Given a filepath and dirpath, get the first directory.
 */
export function getSubFolder(file: string, refDir: string): string | null {
  const separator = escapeStringRegexp(path.sep)
  const baseDir = escapeStringRegexp(path.basename(refDir))
  const regexSubFolder = new RegExp(`${baseDir}${separator}(.*?)${separator}.*`)
  const match = regexSubFolder.exec(file)
  return match && match[1]
}

export function normalizeUrl(rawUrls: string[]): string {
  const urls = rawUrls
  const resultArray: any[] = []

  // If the first part is a plain protocol, we combine it with the next part.
  if (urls[0].match(/^[^/:]+:\/*$/) && urls.length > 1) {
    const first = urls.shift()
    urls[0] = first + urls[0]
  }

  // There must be two or three slashes in the file protocol,
  // two slashes in anything else.
  const replacement = urls[0].match(/^file:\/\/\//) ? '$1:///' : '$1://'
  urls[0] = urls[0].replace(/^([^/:]+):\/*/, replacement)

  // eslint-disable-next-line
  for (let i = 0; i < urls.length; i++) {
    let component = urls[i]

    if (typeof component !== 'string') {
      throw new TypeError(`Url must be a string. Received ${typeof component}`)
    }

    if (component === '') {
      // eslint-disable-next-line
      continue
    }

    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[/]+/, '')
    }

    // Removing the ending slashes for each component but the last.
    // For the last component we will combine multiple slashes to a single one.
    component = component.replace(/[/]+$/, i < urls.length - 1 ? '' : '/')

    resultArray.push(component)
  }

  let str = resultArray.join('/')
  // Each input component is now separated by a single slash
  // except the possible first plain protocol part.

  // Remove trailing slash before parameters or hash.
  str = str.replace(/\/(\?|&|#[^!])/g, '$1')

  // Replace ? in parameters with &.
  const parts = str.split('?')
  str = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&')

  // Dedupe forward slashes.
  str = str.replace(/^\/+/, '/')

  return str
}

/**
 * Alias filepath relative to site directory, very useful so that we
 * don't expose user's site structure.
 * Example: some/path/to/website/docs/foo.md -> @site/docs/foo.md
 */
export function aliasedSitePath(filePath: string, siteDir: string) {
  const relativePath = path.relative(siteDir, filePath)
  // Cannot use path.join() as it resolves '../' and removes
  // the '@site'. Let webpack loader resolve it.
  return `@site/${relativePath}`
}

export function normalizeToSiteDir(filePath, siteDir) {
  if (filePath && path.isAbsolute(filePath)) {
    return posixPath(path.relative(siteDir, filePath))
  }
  return posixPath(filePath)
}

export function compileWebpack(config: Configuration): Promise<any> {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      }
      if (stats.hasErrors()) {
        stats.toJson('errors-only').errors.forEach((e) => {
          console.error(e)
        })
        reject(new Error('Failed to compile with errors.'))
      }
      if (stats.hasWarnings()) {
        stats.toJson('errors-warnings').warnings.forEach((warning) => {
          console.warn(warning)
        })
      }
      resolve()
    })
  })
}

export function mergeWebpackConfig(baseConfig: any, config: string | object): Configuration {
  let webpackConfig = baseConfig

  if (typeof config === 'object') {
    webpackConfig = merge(baseConfig, config)
  } else if (fs.existsSync(config)) {
    webpackConfig = merge(baseConfig, require(config))
  }

  return webpackConfig as Configuration
}

const store: any = {}
export function globalStore<T = any>(type: 'get' | 'set', key: string, value?: T): T | undefined {
  if (type === 'set') {
    _.set(store, key, value)
    return undefined
  }
  return _.get(store, key, value)
}

export function isCliDev() {
  return __dirname.indexOf(libRootPath) > -1
}

export function getCliDevRootDir() {
  const rootPathIdx = __dirname.indexOf(libRootPath)
  const devRootDir = __dirname.substring(0, rootPathIdx) + libRootPath
  return devRootDir
}

export function getModulePath(siteDir: string, lib: string, required: boolean = false) {
  const isDev = isCliDev()
  const devRootDir = getCliDevRootDir()

  const isLib = lib.indexOf('lib/') === 0
  const libPath = !isLib ? lib : lib.split('lib/')[1]
  const prodPath = `node_modules/${!isLib ? '' : `@${libName}/`}${libPath}`

  const libPaths = [
    `${siteDir}/${prodPath}`,
    path.resolve(siteDir, `../../${prodPath}`),
    path.resolve(siteDir, `../../../../${prodPath}`),
  ]

  if (isLib) {
    libPaths.push(`${devRootDir}/packages/${libPath}`)
  }

  if (isDev) {
    libPaths.push(`${devRootDir}/${prodPath}`)
  }

  const result = libPaths.filter((corePath) => fs.pathExistsSync(corePath))[0]

  if (!result && required) {
    throw new Error(`Can not find path: ${lib}.\nSearched paths:\n${libPaths.join('\n')}`)
  }

  return result
}
