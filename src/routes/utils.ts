import { PagePreset, RouteItem } from './types'

const contextPath = ''
const pathPrefix = ''

// 计算 路由 path
export const getRoutePath = (path: string[] | string) => {
  return path && path[0] === '/' ? contextPath + path : `${contextPath}${pathPrefix}/${path}`
}

type PageFileOption = Partial<Pick<RouteItem, 'path' | 'pathToComponent' | 'nodePath'>>
// 获取pages内组件文件在项目内的物理路径，用于 webpack 懒加载文件与打包
export const getPageFilePath = (option: PageFileOption) => {
  const { pathToComponent, path = '' } = option

  const componentPath = typeof pathToComponent === 'string' ? pathToComponent : getRoutePath(path)
  const filePath = componentPath[0] !== '/' ? componentPath : componentPath.substr(1)
  return filePath
}

// 获取页面预设值
export const getPagePreset = (option: PageFileOption): PagePreset | undefined => {
  const filePath = getPageFilePath(option)

  try {
    const limitConf = require(/* webpackInclude: /pages\/.*\/limit\.ts?$/ */
    /* webpackChunkName: "limit_[request]" */
    `~/pages/${filePath}/preset.ts`)
    return limitConf.default
  } catch (e) {
    //
  }
}

// 获取 nodePath
export const getNodePath = (options: PageFileOption) => {
  const { nodePath, pathToComponent, path } = options
  return nodePath || pathToComponent || path || ''
}
