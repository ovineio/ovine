import { Loader } from 'webpack'

type TemplateConfig = {
  path?: string
  head?: string
  preBody?: string
  postBody?: string
}

type DevServerConfig = {
  publicPath: string
  openPage: string
  proxy: any
  [key: string]: any
}
// TODO: v1 版本重新梳理 配置命名
export type SiteConfig = {
  favicon: string // 网站图标
  title: string // 网站标题
  publicPath: string // 静态资源的路径前缀
  devServer: Partial<DevServerConfig> // webpack devServer配置
  ui: {
    initTheme?: string
    withoutPace?: boolean
  }
  envModes?: string[]
  staticFileExts?: string[]
  template?: TemplateConfig
  styledConfig?: any
  cacheGroups?: {
    [key: string]: object
  }
  splitRoutes?: Array<{
    // witch route page should be split
    test: RegExp
    name: string
  }>
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
  hot: boolean
  localIp: boolean
  open: boolean
  dll: boolean
  scssUpdate: boolean
}

export type BuildCliOptions = CliOptions & {
  bundleAnalyzer: boolean
}

export type DllCliOptions = {
  embedAssets: boolean // convert all asset files to base64, reduce http request
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
