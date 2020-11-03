import { Loader } from 'webpack'

type TemplateConfig = {
  path?: string
  head?: string
  preBody?: string
  postBody?: string
}

export type SiteConfig = {
  favicon: string
  title: string
  publicPath: string
  routePrefix: string
  devServerProxy: any
  envModes?: string[]
  staticFileExts?: string[]
  template?: TemplateConfig
  initTheme?: string
  cacheGroups?: {
    [key: string]: object
  }
  splitRoutes?: Array<{
    // witch route page should be split
    test: RegExp
    name: string
  }>
  ui?: {
    withoutPace: boolean
  }
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
  localIp: boolean
  open: boolean
  dll: boolean
  scssUpdate: boolean
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
