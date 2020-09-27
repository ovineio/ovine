/**
 * 路由相关工具函数
 * TODO: 添加 unit test
 */

import { cloneDeep } from 'lodash'

import { app } from '@/app'
import logger from '@/utils/logger'
import { ReqMockSource } from '@/utils/request/types'
import { isSubStr, retryPromise, loadScriptAsync } from '@/utils/tool'

import { PageFileOption, PagePreset } from './types'

const log = logger.getLogger('lib:routes:exports')

// 计算 路由 path
export function getRoutePath(path: string, origin: boolean = false) {
  const baseUrl = app.constants.baseUrl || '/'
  const currPthStr = currPath(path)
  const pathStr = `/${currPthStr}`
  const withBaseUrl = isSubStr(pathStr, baseUrl, 0)

  let routePath = `${withBaseUrl ? '/' : baseUrl}${currPthStr}`
  if (origin) {
    routePath = pathStr.replace(new RegExp(`^${baseUrl}`), '/')
  }

  return routePath
}

// 判断是否是远程文件地址
function isLocalFile(url: string) {
  return !(url.indexOf('://') > -1 || url.startsWith('//'))
}

// 获取 pages 内组件文件在项目内本地的相对路径 或者 远程服务器路径，
export function getPageFilePath(option: PageFileOption): string {
  const { pathToComponent, path = '' } = option
  const url = typeof pathToComponent === 'string' ? pathToComponent : path

  // 本地文件路径
  if (isLocalFile(url)) {
    return currPath(url)
  }

  // 当前域名服务器下路径
  if (url.startsWith('root://')) {
    return window.location.origin + url.substring(6)
  }

  // 远程服务器下 路径
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 宽泛协议
  if (url.startsWith('//')) {
    return window.location.protocol + url
  }

  return ''
}

// 获取 页面预设值。默认为  pages/xxx/preset.ts 该文件是权限设置必须文件
export function getPagePreset(option: PageFileOption): PagePreset | undefined {
  const filePath = getPageFilePath(option)

  if (app.asyncPage?.preset && option.nodePath && app.asyncPage.preset[option.nodePath]) {
    return cloneDeep(app.asyncPage.preset[option.nodePath])
  }

  // 加载本地文件
  if (isLocalFile(filePath)) {
    try {
      /* webpackInclude: /pages[\\/].*[\\/]preset\.[t|j]sx?$/ */
      const pagePest = require(`~/pages/${filePath}/preset`)
      return pagePest.default
    } catch (e) {
      //
    }
  }

  return undefined
}

// 获取 mock。默认为  pages/xxx/mock.ts 存在该文件，将自动注入mock到prest每一个 api
export function getPageMockSource(option: PageFileOption): ReqMockSource | undefined {
  if (!app.env.isMock) {
    return undefined
  }

  if (app.asyncPage?.mock && option.nodePath && app.asyncPage.mock[option.nodePath]) {
    return cloneDeep(app.asyncPage.mock[option.nodePath])
  }

  const filePath = getPageFilePath(option)

  // 加载本地文件
  if (isLocalFile(filePath)) {
    try {
      /* webpackInclude: /pages[\\/].*[\\/]mock\.[t|j]sx?$/ */
      const pagePest = require(`~/pages/${filePath}/mock`)
      return pagePest.default
    } catch (e) {
      //
    }
  }

  return undefined
}

// 异步获取页面文件
export async function getPageFileAsync(option: PageFileOption) {
  const filePath = getPageFilePath(option)
  const defaultContent = { schema: {} }
  const pageAlias = option.nodePath

  // 加载本地文件
  if (isLocalFile(filePath)) {
    return retryPromise(() =>
      import(
        /* webpackInclude: /[\\/]src[\\/]pages[\\/].*[\\/]index\.[t|j]sx?$/ */
        /* webpackChunkName: "p_[request]" */
        `~/pages/${filePath}/index`
      )
    )
  }

  if (!pageAlias) {
    return defaultContent
  }

  if (app.asyncPage?.schema && app.asyncPage.schema[pageAlias]) {
    return cloneDeep(app.asyncPage.schema[pageAlias])
  }

  // 服务器远程 url 地址需要远程加载页面
  return retryPromise(() => {
    app.asyncPage.schema = app.asyncPage?.schema || {}
    // 异步加载脚本，规范 window.ovine.addPageSchemaJs(option.nodePath, {default?,schema})
    return loadScriptAsync(filePath).then(function() {
      if (!app.asyncPage.schema[pageAlias]) {
        log.error(`${filePath} 异步页面加载失败，请检查页面是否符合规范`)
        return defaultContent
      }
      return cloneDeep(app.asyncPage.schema[pageAlias])
    })
  })
}

// 获取 nodePath
export function getNodePath(option: PageFileOption) {
  return option.nodePath || getPageFilePath(option)
}

// 当前路径,去除多余前缀/,保持一致性  /login ==> login
export function currPath(path?: string, defaultPath: string = '') {
  if (!path || path === '/') {
    return defaultPath
  }

  return !isSubStr(path, '/', 0) ? path : path.substring(1)
}
