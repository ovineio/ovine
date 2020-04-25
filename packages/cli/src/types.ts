import { Loader } from 'webpack'

type TemplateConfig = {
  head?: string
  preBody?: string
  postBody?: string
}

export type SiteConfig = {
  publicPath: string
  favicon: string
  title: string
  envModes: string[]
  devServerProxy: any
  staticFileExt?: string
  template?: TemplateConfig
  isSplitCode?: boolean // is split code by route
  splitCodeRoutes?: string[] // witch route page should be split
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
  dll: boolean
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
