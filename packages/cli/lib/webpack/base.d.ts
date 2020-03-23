import { Configuration } from 'webpack';
import { BuildCliOptions, DevCliOptions, Props } from '../types';
declare type BaseConfigOptions = Props & Partial<DevCliOptions> & Partial<BuildCliOptions>;
export declare function createBaseConfig(options: BaseConfigOptions): Configuration;
export {};
//# sourceMappingURL=base.d.ts.map