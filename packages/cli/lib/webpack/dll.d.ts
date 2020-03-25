/// <reference types="webpack-dev-server" />
import { DllCliOptions, Props } from '../types';
declare type ConfigOptions = Props & Partial<DllCliOptions>;
export declare function createDllConfig(options: ConfigOptions): import("webpack").Configuration;
export {};
