/**
 * 路由相关工具函数
 * TODO: 添加 unit test
 */

import { cloneDeep } from 'lodash'

import { app } from '@/app'
import { rootPath } from '@/constants'
import logger from '@/utils/logger'
import { ReqMockSource } from '@/utils/request/types'
import { isSubStr, retryPromise, loadScriptAsync, deserialize } from '@/utils/tool'

import { PageFileOption, PagePreset } from './types'

const log = logger.getLogger('lib:routes:exports')

// 计算 路由 path
export function getRoutePath(path: string, origin: boolean = false) {
  const pathPrefix = app.constants.pathPrefix || rootPath
  const currPthStr = currPath(path)
  const pathStr = `${rootPath}${currPthStr}`
  const withBaseUrl = isSubStr(pathStr, pathPrefix, 0)

  let routePath = `${withBaseUrl ? rootPath : pathPrefix}${currPthStr}`
  if (origin) {
    routePath = pathStr.replace(new RegExp(`^${pathPrefix}`), rootPath)
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

  // API 请求路由支持 GET 请求
  const apiUrlReg = /^([a-zA-Z0-9]{1,10}):\/\/(.+)$/
  const apiDomainMatches = url.match(apiUrlReg)
  if (apiDomainMatches) {
    const info = app.request.getUrlByOption({
      url: apiDomainMatches[2],
      domain: apiDomainMatches[1],
    })
    return info.url
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

  // 动态渲染页面
  return retryPromise(() => {
    app.asyncPage.schema = app.asyncPage?.schema || {}

    // 异步加载脚本，规范 window.ovine.addPageSchemaJs(option.nodePath, {default?,schema})
    if (/\.js/.test(filePath)) {
      return loadScriptAsync(filePath)
        .then(() => {
          if (!app.asyncPage.schema[pageAlias]) {
            log.error(
              `Please add page schema for "${pageAlias}" by using 'window.ovine.addPageSchemaJs()'.`
            )
            return defaultContent
          }
          return cloneDeep(app.asyncPage.schema[pageAlias])
        })
        .catch((err) => {
          log.error('An error occurred by load js scripts.', err)
          return defaultContent
        })
    }

    // 接口获取  schema, 单词浏览缓存页面，刷新浏览器更新页面
    return app
      .request<{ schema: string }>({
        method: 'GET',
        url: filePath,
      })
      .then((source) => {
        const schema = deserialize(source?.data?.schema || '')
        if (!schema) {
          log.error(`Please add page schema string for "${pageAlias}" by http server api.`)
          return defaultContent
        }

        // 缓存，下次无需读接口，刷新页面缓存失效
        app.asyncPage.schema[pageAlias] = schema

        return schema
      })
      .catch((err) => {
        log.error('An error occurred when fetch page schema.', err)
        return defaultContent
      })
  })
}

// 获取 nodePath
export function getNodePath(option: PageFileOption) {
  return option.nodePath || getPageFilePath(option)
}

// 当前路径,去除多余前缀/,保持一致性  /login ==> login
export function currPath(path?: string, defaultPath: string = '') {
  if (!path || path === rootPath) {
    return defaultPath
  }

  return !isSubStr(path, rootPath, 0) ? path : path.substring(1)
}

// amis 官方 格式化项目内 链接
export const normalizeLink = (option: { location?: any; to?: string }) => {
  const { location: loc = window.location, to: toLink } = option

  const location = {
    pathname: rootPath,
    search: '',
    hash: '',
    ...loc,
  }

  let to = toLink || ''

  if (to && to[0] === '#') {
    to = location.pathname + location.search + to
  } else if (to && to[0] === '?') {
    to = location.pathname + to
  }

  const searchIdx = to.indexOf('?')
  const hashIdx = to.indexOf('#')
  const isSearch = searchIdx > -1
  const isHash = hashIdx > -1

  let pathname = isSearch ? to.substring(0, searchIdx) : isHash ? to.substring(0, hashIdx) : to
  const search = isSearch ? to.substring(searchIdx, isHash ? hashIdx : undefined) : ''
  const hash = isHash ? to.substring(hashIdx) : location.hash

  if (!pathname) {
    pathname = location.pathname
  } else if (pathname[0] !== rootPath && !/^https?:\/\//.test(pathname)) {
    const relativeBase = location.pathname
    const paths = relativeBase.split(rootPath)
    paths.pop()
    let m = /^\.\.?\//.exec(pathname)

    while (m) {
      if (m[0] === '../') {
        paths.pop()
      }
      pathname = pathname.substring(m[0].length)
      m = /^\.\.?\//.exec(pathname)
    }
    pathname = paths.concat(pathname).join(rootPath)
  }

  return {
    href: pathname + search + hash,
    pathname,
    search,
    hash,
  }
}
export function jumpTo(link: string, blank: boolean = false) {
  const { href } = normalizeLink({ to: link })

  if (/^https?:\/\//.test(href)) {
    if (!blank) {
      window.location.replace(href)
    } else {
      window.open(href, '_blank')
    }
    return
  }
  const { pathPrefix } = app.constants
  if (!blank) {
    if (pathPrefix === rootPath) {
      app.routerHistory.push(href)
    } else {
      app.routerHistory.push(href.replace(new RegExp(`^${pathPrefix}`), rootPath))
    }
  } else {
    window.open(`${window.location.origin}${href}`, '_blank')
  }
}
