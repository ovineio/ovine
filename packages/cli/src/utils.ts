import chalk from 'chalk'
import fse from 'fs-extra'
import importFresh from 'import-fresh'
import _ from 'lodash'
import path from 'path'
import webpack, { Configuration } from 'webpack'
import merge from 'webpack-merge'
import request from 'request'
import { execSync } from 'child_process'
import util from 'util'

import {
  libRootPath,
  libName,
  dllVer,
  libVer,
  dllVendorDirPath,
  dllAssetsFile,
  dllVendorFileName,
  dllManifestFile,
  generatedDirName,
  winConst,
  dllJsdelivrHostDir,
} from './constants'
import { BuildCliOptions, PkgName, Props, SiteConfig } from './types'

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

export function compileWebpack(config: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      }
      if (stats?.hasErrors()) {
        stats.toJson('errors-only').errors.forEach((e) => {
          console.error(e)
        })
        reject(new Error('Failed to compile with errors.'))
      }
      if (stats?.hasWarnings()) {
        stats.toJson('errors-warnings').warnings.forEach((warning) => {
          console.warn(warning)
        })
      }
      resolve(true)
    })
  })
}

export function mergeWebpackConfig(baseConfig: any, config: string | object): Configuration {
  let webpackConfig = baseConfig

  if (typeof config === 'object') {
    webpackConfig = merge(baseConfig, config)
  } else if (typeof config === 'string' && fse.existsSync(config)) {
    webpackConfig = merge(baseConfig, importFresh(config) as any)
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
  return __dirname.indexOf(`@${libName}`) === -1 && __dirname.indexOf(libRootPath) > -1
}

export function getCliDevRootDir() {
  return __dirname.substring(0, __dirname.indexOf(libRootPath)) + libRootPath
}

export function getModulePath(siteDir: string, lib: string, required: boolean = false) {
  const isDev = isCliDev()
  const devRootDir = getCliDevRootDir()

  const isLib = lib.indexOf('lib/') === 0
  const libPath = !isLib ? lib : lib.replace(/^lib\//, '')
  const prodPath = `node_modules/${!isLib ? '' : `@${libName}/`}${libPath}`

  const libPaths = [
    `${siteDir}/${prodPath}`,
    path.resolve(siteDir, `../../${prodPath}`),
    path.resolve(siteDir, `../../../../${prodPath}`),
  ]

  if (isDev) {
    libPaths.push(`${devRootDir}/${prodPath}`)
  }

  if (isDev && isLib) {
    libPaths.push(`${devRootDir}/packages/${libPath}`)
  }

  const modulePath = libPaths.find((corePath) => fse.pathExistsSync(corePath))

  if (!modulePath && required) {
    throw new Error(`Can not find path: ${lib}.\nSearched paths:\n${libPaths.join('\n')}`)
  }

  return modulePath
}

export function getDllHostDir(options: Partial<SiteConfig>) {
  const { publicPath, dll = {} } = options
  const confHostDir = dll.hostDir || `${dll.publicPath || publicPath}${dllVendorDirPath}/`

  const hostDir = (dll.useJsdelivr ? dllJsdelivrHostDir : confHostDir)
    .replace('[libVer]', libVer)
    .replace('[dllVer]', dllVer)

  const backHostDir = `${publicPath}${dllVendorDirPath}/`

  return [hostDir, backHostDir]
}

export function getDllManifestFile(siteDir: string) {
  const assetsFile = `${siteDir}/${dllAssetsFile.replace('[name]', dllVendorFileName)}`
  const manifestFile = `${siteDir}/${dllManifestFile.replace('[name]', dllVendorFileName)}`

  return {
    assetsFile,
    manifestFile,
  }
}

type ManifestInfo = {
  hostDir: string
  assetsFile: string
  manifestFile: string
  assetJson: any
}
export async function loadDllManifest(options: Props & Partial<BuildCliOptions>) {
  const { siteDir } = options
  const [hostDir, backHostDir] = getDllHostDir(options.siteConfig)
  const files = getDllManifestFile(siteDir)

  const { assetsFile, manifestFile } = files

  const backFiles = {
    ...files,
    hostDir: backHostDir,
  }

  const cacheDir = `${siteDir}/${generatedDirName}/cache`

  const dllHostDirKey = 'DLL_HOST_DIR'
  const assetsFileName = path.basename(assetsFile)
  const manifestFileName = path.basename(manifestFile)
  const cacheAssetsFile = `${cacheDir}/${assetsFileName}`
  const cacheManifestFile = `${cacheDir}/${manifestFileName}`

  const cachedFiles = {
    hostDir,
    assetsFile: cacheAssetsFile,
    manifestFile: cacheManifestFile,
  }

  const getManifest = (filesData: any) => {
    try {
      const assetJson = require(filesData.assetsFile)
      return {
        assetJson,
        hostDir,
        ...filesData,
      }
    } catch (err) {
      console.log(chalk.red(`\nload assetsFile: ${filesData.assetsFile} with error. \n`, err))
    }
  }

  const fetchManifest = async () => {
    // check cache files if exits
    if (_.values(cachedFiles).every((filePath) => fse.existsSync(filePath))) {
      const assetJson = await fse.readJSON(cacheAssetsFile)
      // check the cache if valid
      if (assetJson[winConst.dllVersion] === dllVer && assetJson[dllHostDirKey] === hostDir) {
        // already cached
        return getManifest(cachedFiles)
      }
    }

    const httpAssetFile = `${hostDir}${assetsFileName}`
    const httpManifestFile = `${hostDir}${manifestFileName}`
    const getFileAsync = util.promisify(request.get)

    // download manifest files to cache
    await Promise.all(
      [httpAssetFile, httpManifestFile].map((httpFile) => {
        return getFileAsync(httpFile).then((fileRes) => {
          if (fileRes.headers['content-type'].indexOf('application/json') === -1) {
            throw new Error(`apply ${httpFile} with error.`)
          }
          const cachePath = `${cacheDir}/${path.basename(httpFile)}`
          let jsonBody = fileRes.body

          if (httpFile === httpAssetFile) {
            const assetJson = JSON.parse(jsonBody)
            assetJson[dllHostDirKey] = hostDir
            jsonBody = JSON.stringify(assetJson)
          }

          fse.ensureFileSync(cachePath)
          fse.writeFileSync(cachePath, jsonBody, {
            encoding: 'utf-8',
          })
        })
      })
    )
    return getManifest(cachedFiles)
  }

  let manifestInfo: any = {}

  if (hostDir.startsWith('http')) {
    try {
      manifestInfo = await fetchManifest()
    } catch (err) {
      manifestInfo = getManifest(backFiles)
      // console.log(`load host dll manifest files.`,err) // print log when needed
    }
  } else {
    manifestInfo = getManifest(backFiles)
  }

  return manifestInfo as ManifestInfo
}

export function getPkgName(pkg?: PkgName) {
  return `@${libName}/${pkg || ''}`
}

export function getPkgLatestVer() {
  const latestVer = execSync(`npm view ${getPkgName('cli')} version`)
    .toString()
    .replace('\n', '')

  return latestVer
}
