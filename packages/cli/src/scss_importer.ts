/**
 *   scss importer
 */
import fs from 'fs-extra'
import path from 'path'

import { scssDirName } from './constants'
import { getModulePath } from './utils'

/* eslint-disable react/no-this-in-sfc */

function getIncludePaths(pathStr: string, prev: string): string[] {
  const includePaths: string[] = []

  if (path.isAbsolute(prev)) {
    includePaths.push(path.dirname(prev))
  }

  return [...includePaths, ...pathStr.split(path.delimiter)]
}

const alias = {
  '@lib/': './',
  '@amis/': '../',
}

function importer(this: any, url: string, prev: string) {
  const { includePaths, file } = this.options
  const contextPaths = getIncludePaths(includePaths, prev)

  const urlAlias = Object.keys(alias).find((i) => url.indexOf(i) === 0)
  const realUrl = !urlAlias ? url : url.replace(urlAlias, alias[urlAlias])

  const libScss = getModulePath(__dirname, `lib/core/${scssDirName}`, true)
  const isLibScss = file.indexOf(libScss) > -1

  const filePath = contextPaths
    .map((dir) => path.resolve(dir, realUrl))
    .find((item) => fs.existsSync(item))

  // console.log('==', { filePath, realUrl, contextPaths })

  if (path.isAbsolute(url)) {
    return null
  }

  // libScss not check file exists
  if (!filePath && isLibScss) {
    return {
      file: '',
      contents: '',
    }
  }

  return {
    contents: `@import "${filePath}";`,
  }
}

export = importer
