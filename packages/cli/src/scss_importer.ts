/**
 *   scss importer of ovine app scss files for  rewrite amis scss theme variables.
 */
import fs from 'fs-extra'
import _ from 'lodash'
import path from 'path'

import { scssDirName } from './constants'
import { getModulePath, globalStore, isCliDev } from './utils'

/* eslint-disable react/no-this-in-sfc */

function getSassUrlVariants(url: string, extensions: string[] = ['.scss']) {
  const parsedUrl = path.parse(url)
  const urlVariants = [url]

  if (parsedUrl.dir && !parsedUrl.ext) {
    extensions.forEach((extension) => {
      urlVariants.push(path.join(parsedUrl.dir, `${parsedUrl.name}${extension}`))
      urlVariants.push(path.join(parsedUrl.dir, `_${parsedUrl.name}${extension}`))
    })
  }

  return urlVariants
}

function logIncludePaths(content: any) {
  const flag = 'isLogIncludePaths'
  if (!globalStore('get', flag)) {
    console.log('sass paths content:\n', content, '\n')
    globalStore('set', flag, true)
  }
}

function getIncludePaths(pathStr: string, prev: string): string[] {
  const includePaths: string[] = []

  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev))
  }

  return [...includePaths, ...pathStr.split(path.delimiter)]
}

const alias = {
  '@lib/': './_lib/',
  '@amis/': '../',
}

function importer(this: any, url: string, prev: string) {
  const { includePaths, file } = this.options
  const contextPaths = getIncludePaths(includePaths, prev)

  if (isCliDev()) {
    logIncludePaths({ includePaths, contextPaths })
  }

  const urlAlias = Object.keys(alias).find((i) => url.indexOf(i) === 0)
  const realUrl = !urlAlias ? url : url.replace(urlAlias, alias[urlAlias])

  const libScss = getModulePath(__dirname, `lib/core/${scssDirName}`, true)
  const isLibScss = file.indexOf(libScss) > -1
  const isSiteGlobal = url.indexOf('_global.scss') > -1

  // libScss not check file exists
  if (isLibScss || isSiteGlobal) {
    const filePath = _.flatten(
      contextPaths.map((dir) => getSassUrlVariants(realUrl).map((item) => path.resolve(dir, item)))
    ).find((item) => {
      return fs.existsSync(item)
    })

    return (
      !filePath && {
        file: '',
        contents: '',
      }
    )
  }

  // replace url alias
  if (urlAlias) {
    return {
      file: realUrl,
    }
  }

  return null
}

export = importer
