/**
 * dev command for webpack dev server
 */
import { DevCliOptions } from '../types';
declare type Options = Partial<DevCliOptions> & {
    isReload?: boolean;
};
export declare function dev(siteDir: string, options?: Options): Promise<void>;
export {};
//# sourceMappingURL=dev.d.ts.map