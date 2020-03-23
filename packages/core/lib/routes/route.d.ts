/**
 * APP 路由相关组件
 */
import React from 'react';
import { CheckLimitFunc, PresetRouteProps, RouteItem } from "./types";
export declare const getPageAsync: (option: PresetRouteProps) => React.LazyExoticComponent<() => JSX.Element>;
export declare const PrivateRoute: ({ onAuth, redirect, children, ...rest }: any) => JSX.Element | null;
export declare const usePresetContext: () => {
    checkLimit: CheckLimitFunc;
    nodePath?: string | undefined;
    limits?: Types.ObjectOf<import("./types").Limit> | undefined;
    apis?: Types.ObjectOf<Req.Option<{}, {}> & import("./types").LimitSchema & {
        key?: string | undefined;
    }> | undefined;
};
export declare const PrestRoute: (props: PresetRouteProps) => JSX.Element;
export declare const AppMenuRoutes: (props: {
    authRoutes: RouteItem[];
}) => JSX.Element;
//# sourceMappingURL=route.d.ts.map