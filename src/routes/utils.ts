import { PageFileOption, PagePreset } from './types'

const contextPath = ''
const pathPrefix = ''

// 计算 路由 path
export const getRoutePath = (path: string[] | string) => {
  return path && path[0] === '/' ? contextPath + path : `${contextPath}${pathPrefix}/${path}`
}

// 获取pages内组件文件在项目内的物理路径，用于 webpack 懒加载文件与打包
export const getPageFilePath = (option: PageFileOption) => {
  const { pathToComponent, path = '' } = option
  const componentPath = typeof pathToComponent === 'string' ? pathToComponent : getRoutePath(path)
  const filePath = componentPath[0] !== '/' ? componentPath : componentPath.substr(1)
  return filePath
}

// 获取 页面预设值。默认为  pages/xxx/preset.ts 该文件是权限设置必须文件
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
export const getNodePath = (option: PageFileOption) => {
  const { nodePath } = option
  const filePath = getPageFilePath(option)

  return nodePath || filePath ? `/${filePath}` : ''
}
