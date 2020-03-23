/**
 * APP 路由相关组件
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Spinner } from 'amis';
import { eachTree } from 'amis/lib/utils/helper';
import { isFunction, map } from 'lodash';
import React, { createContext, lazy, useContext, useMemo, Suspense, useState, useEffect, } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { app } from "../app";
import NotFound from "../components/404";
import { Amis } from "../components/amis/schema";
import { LayoutLazyFallback } from "../components/aside_layout/loading";
import ErrorBoundary from "../components/error_boundary";
import { isSubStr } from "../utils/tool";
import { getNodePath, getPageFileAsync, getPageMockSource, getPagePreset, getRoutePath, currPath, } from "./exports";
import { checkLimitByKeys } from "./limit/exports";
const PageSpinner = React.createElement(Spinner, { overlay: true, show: true, size: "lg", key: "pageLoading" });
// 根据 path，pathToComponent  参数 懒加载 `pages/xxx` 组件
export const getPageAsync = (option) => {
    return lazy(() => getPageFileAsync(option).then((file) => {
        const { default: content = {}, schema } = file;
        const compProps = {};
        if (isFunction(content)) {
            compProps.LazyFileComponent = content;
        }
        else {
            if (schema) {
                content.schema = schema;
            }
            compProps.lazyFileAmisProps = content;
        }
        return {
            default: () => React.createElement(PrestComponent, Object.assign({}, option, compProps)),
        };
    }));
};
// 登录路由拦截
export const PrivateRoute = (_a) => {
    var { onAuth, redirect, children } = _a, rest = __rest(_a, ["onAuth", "redirect", "children"]);
    const [isAuth, setAuth] = useState(null);
    useEffect(() => {
        const authState = isFunction(onAuth) ? onAuth() : true;
        if (authState.then) {
            authState.then((res) => {
                setAuth(res);
            });
        }
        else {
            setAuth(authState);
        }
    }, []);
    if (isAuth === null) {
        return null;
    }
    return (React.createElement(Route, Object.assign({}, rest, { render: ({ location }) => {
            if (isAuth) {
                return children;
            }
            if (redirect) {
                return (React.createElement(Redirect, { to: {
                        pathname: redirect,
                        state: { from: location },
                    } }));
            }
            return null;
        } })));
};
// usePresetContext 可获取 preset 值，与 checkLimit 校验权限 方法
const PresetContext = createContext({});
export const usePresetContext = () => {
    const preset = useContext(PresetContext);
    const checkLimit = (keys, option) => checkLimitByKeys(keys, Object.assign({ nodePath: preset.nodePath }, option));
    return Object.assign(Object.assign({}, preset), { checkLimit });
};
// 将 preset 注入组件，可全局通过 usePresetContext 获取 preset 值
const PrestComponent = (props) => {
    const { LazyFileComponent, lazyFileAmisProps, RouteComponent } = props, rest = __rest(props, ["LazyFileComponent", "lazyFileAmisProps", "RouteComponent"]);
    const { path, pathToComponent, nodePath: propNodePath } = rest;
    const preset = useMemo(() => {
        const fileOption = { path, pathToComponent, nodePath: propNodePath };
        const mockSource = getPageMockSource(fileOption);
        const pagePreset = getPagePreset(fileOption) || {};
        const nodePath = getNodePath(fileOption);
        pagePreset.nodePath = nodePath;
        map(pagePreset.apis, (api) => {
            const { mock, mockSource: apiMockSource, url = '' } = api;
            // 自动注入规则
            if (mock === true && !apiMockSource && mockSource) {
                api.mockSource = mockSource[url] || mockSource;
            }
        });
        return pagePreset;
    }, [path, pathToComponent, propNodePath]);
    let Component = React.createElement("div", null, "Not Found \u8BF7\u68C0\u67E5\u8DEF\u7531\u8BBE\u7F6E");
    if (LazyFileComponent) {
        Component = React.createElement(LazyFileComponent, Object.assign({}, rest));
    }
    if (RouteComponent) {
        Component = React.createElement(RouteComponent, Object.assign({}, rest));
    }
    if (lazyFileAmisProps) {
        lazyFileAmisProps.schema.preset = Object.assign(Object.assign({}, lazyFileAmisProps.schema.preset), preset);
        Component = React.createElement(Amis, Object.assign({}, rest, lazyFileAmisProps));
    }
    return React.createElement(PresetContext.Provider, { value: preset }, Component);
};
// 处理每个路由，包裹 PrestComponent 组件
export const PrestRoute = (props) => {
    const { withSuspense = true, fallback = PageSpinner, path = '', component, exact = true } = props, rest = __rest(props, ["withSuspense", "fallback", "path", "component", "exact"]);
    const routePath = getRoutePath(path);
    if (exact && !isSubStr(routePath, ':') && routePath !== window.location.pathname) {
        return React.createElement(Redirect, { to: getRoutePath(app.constants.notFound.route) });
    }
    const RouteComponent = (React.createElement(Route, Object.assign({}, rest, { path: routePath, exact: exact, component: !component
            ? getPageAsync(props)
            : () => React.createElement(PrestComponent, Object.assign({}, props, { RouteComponent: component })) })));
    if (withSuspense) {
        return (React.createElement(ErrorBoundary, { type: "page" },
            React.createElement(Suspense, { fallback: fallback }, RouteComponent)));
    }
    return RouteComponent;
};
const NotFoundRoute = () => {
    let Component = NotFound;
    try {
        Component = require(`~/pages/${currPath(app.constants.notFound.pagePath, '404')}`);
    }
    catch (e) {
        //
    }
    return React.createElement(Route, { path: "*", component: Component });
};
// 将 routeConfig 转换为 route
export const AppMenuRoutes = (props) => {
    const menuRoutes = [];
    props.authRoutes.forEach(({ children }) => {
        if (!children) {
            return;
        }
        eachTree(children, (item) => {
            if (item.path && !item.limitOnly) {
                menuRoutes.push(React.createElement(PrestRoute, Object.assign({ key: menuRoutes.length + 1, withSuspense: false }, item)));
            }
        });
    });
    return (React.createElement(ErrorBoundary, { type: "page" },
        React.createElement(Suspense, { fallback: React.createElement(LayoutLazyFallback, null) },
            React.createElement(Switch, null,
                menuRoutes,
                React.createElement(NotFoundRoute, null)))));
};
