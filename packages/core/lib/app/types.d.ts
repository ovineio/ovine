import { DefaultTheme } from 'styled-components';
import { LoggerConfig } from "../utils/logger";
import { ClassMethod, DeepPartial, Map } from "../utils/types";
import { AppRequest } from "./request";
import { AppTheme } from "./theme";
declare type Env = {
    mode: string;
    domains: Map<string, string>;
    isRelease?: boolean;
    isProd?: boolean;
    logger?: LoggerConfig;
};
export declare type EnvConfig = {
    default: Env;
    [env: string]: DeepPartial<Env>;
};
export interface AppConfig {
    request: any;
    theme: any;
    env: EnvConfig;
    entry: any[];
    amis: any;
    styled: {
        globalStyle: string | ((theme: DefaultTheme) => any);
    };
    constants: {
        baseUrl: string;
        notFound: {
            route: string;
            pagePath: string;
        };
    };
}
export interface AppDefInstance extends Omit<AppConfig, 'env'> {
    env: Env & {
        isMock: boolean;
    };
    entry: any[];
    request: ClassMethod<AppRequest, 'request'>;
    theme: AppTheme;
}
export {};
