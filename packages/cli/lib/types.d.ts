import { Loader } from 'webpack';
declare type TemplateConfig = {
    head?: string;
    preBody?: string;
    postBody?: string;
};
export declare type SiteConfig = {
    publicPath: string;
    favicon: string;
    title: string;
    envModes: string[];
    devServerProxy: any;
    staticFileExt?: string;
    template?: TemplateConfig;
};
export declare type SiteContext = {
    siteConfig?: SiteConfig;
};
export declare type CliOptions = {
    env: string;
    mock: boolean;
};
export declare type DevCliOptions = CliOptions & {
    port: string;
    host: string;
    open: boolean;
    dll: boolean;
};
export declare type BuildCliOptions = CliOptions & {
    bundleAnalyzer: boolean;
};
export declare type DllCliOptions = {
    bundleAnalyzer: boolean;
};
export interface LoadContext {
    siteDir: string;
    genDir: string;
    siteConfig: SiteConfig;
    outDir: string;
    srcDir: string;
    publicPath: string;
}
export declare type Props = LoadContext;
export interface ConfigureWebpackUtils {
    getStyleLoaders: (isServer: boolean, cssOptions: {
        [key: string]: any;
    }) => Loader[];
    getCacheLoader: (isServer: boolean, cacheOptions?: {}) => Loader | null;
    getBabelLoader: (isServer: boolean, babelOptions?: {}) => Loader;
}
export {};
