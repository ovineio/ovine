import { Loader } from 'webpack'

type TemplateConfig = {
  head?: string
  preBody?: string
  postBody?: string
}

export type SiteConfig = {
  publicPath: string // 静态资源路径
  favicon: string // 网站图标
  title: string // 网站标题
  env: string[] // 所有环境
  // html 模版
  template?: TemplateConfig
}

export type SiteContext = {
  siteConfig?: SiteConfig
}

export type CliOptions = {
  env: string
  mock: boolean
}

export type DevCliOptions = CliOptions & {
  port: string
  host: string
  open: boolean
}

export type BuildCliOptions = CliOptions & {
  bundleAnalyzer: boolean
}

export type DllCliOptions = {
  bundleAnalyzer: boolean
}

export interface LoadContext {
  siteDir: string
  genDir: string
  siteConfig: SiteConfig
  outDir: string
  srcDir: string
  publicPath: string
}

export type Props = LoadContext

export interface ConfigureWebpackUtils {
  getStyleLoaders: (
    isServer: boolean,
    cssOptions: {
      [key: string]: any
    }
  ) => Loader[]
  getCacheLoader: (isServer: boolean, cacheOptions?: {}) => Loader | null
  getBabelLoader: (isServer: boolean, babelOptions?: {}) => Loader
}
