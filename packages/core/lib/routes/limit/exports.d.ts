/**
 * APP 权限相关工具方法
 */
import { CheckLimitFunc } from "../types";
export declare const convertLimitStr: (limitStr?: string) => Types.ObjectOf<boolean>;
export declare const getAppLimits: () => Types.ObjectOf<boolean>;
export declare const setAppLimits: (limitVal: string) => void;
/**
 * 循环调用时一定要, 传 limits 参数
 * @param nodePath 带检查的节点
 * @param limits 权限模版，用检查节点
 */
export declare const checkLimitByNodePath: (nodePath: string, limits?: any) => any;
/**
 * 校验一组权限
 * @param limitKeys 可以是权限 key,或者 nodePath。当为 key 时，一定要传 option.nodePath
 * @param option nodePath 校验节点。 limits 权限模版，用检查节点
 */
export declare const checkLimitByKeys: CheckLimitFunc;
//# sourceMappingURL=exports.d.ts.map