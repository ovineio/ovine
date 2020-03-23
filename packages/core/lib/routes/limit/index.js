/**
 * APP 权限配置表处理
 */
import { filterTree, mapTree } from 'amis/lib/utils/helper';
import map from 'lodash/map';
import { routeLimitKey } from "../../constants";
import { getPagePreset } from "../exports";
import { getRouteConfig } from "../config";
import { checkLimitByNodePath, getAppLimits } from "./exports";
// 处理 preset.limits.needs 配置的数据
const resolveLimitNeeds = (key, limits) => {
    const checked = {};
    const { needs = [] } = limits[key];
    // 便利所有节点
    const getNeeds = (node = []) => {
        // 防止循环依赖
        node.forEach((k) => {
            var _a;
            if (!checked[k]) {
                checked[k] = true;
                getNeeds((_a = limits[k]) === null || _a === void 0 ? void 0 : _a.needs);
            }
        });
    };
    // 添加默认 $page 页面权限
    if (!checked[routeLimitKey]) {
        checked[routeLimitKey] = true;
        needs.push(routeLimitKey);
    }
    getNeeds(needs);
    return Object.keys(checked);
};
// 权限配置表
export const getLimitMenusConfig = () => mapTree(getRouteConfig(), (item) => {
    const newItem = Object.assign({}, item);
    const { nodePath } = newItem;
    const preset = getPagePreset(item);
    const { limits, apis } = preset || {};
    // limits 表示 当前节点 有子权限
    if (limits) {
        newItem.children = map(limits, ({ icon, label, description }, key) => {
            const needs = key === routeLimitKey
                ? undefined
                : resolveLimitNeeds(key, limits).map((needK) => `${nodePath}/${needK}`);
            return {
                label,
                description,
                needs,
                icon: icon || 'fa fa-code',
                nodePath: `${nodePath}/${key}`,
            };
        });
    }
    // 将 preset 配置的 apis， 添加到权限配置表中
    if (apis) {
        const allApis = {};
        map(apis, (apiItem, apiKey) => {
            const { key: apiAuthKey, url, limits: apiNeeds } = apiItem;
            const presetApiNeeds = typeof apiNeeds === 'string' ? [apiNeeds] : apiNeeds;
            allApis[apiKey] = {
                url,
                key: apiAuthKey,
                limits: presetApiNeeds === null || presetApiNeeds === void 0 ? void 0 : presetApiNeeds.concat(routeLimitKey),
            };
        });
        newItem.apis = Object.assign(Object.assign({}, newItem.apis), allApis);
    }
    // 添加默认 icon
    newItem.icon = newItem.icon ? newItem.icon : 'fa fa-code-fork';
    // console.log('-----', routePath, newItem)
    return newItem;
});
// 过滤掉 配置路由信息
// 1. 去除无权限路由
// 2. 去除侧边栏隐藏 菜单项
const filterRoutesConfig = (type) => {
    const limits = getAppLimits();
    if (!Object.keys(limits).length) {
        return [];
    }
    const nodes = filterTree(getRouteConfig(true), ({ sideVisible, nodePath }) => {
        const auth = checkLimitByNodePath(nodePath, limits);
        if (nodePath === '/') {
            return true;
        }
        switch (type) {
            case 'aside':
                return auth && sideVisible !== false;
            default:
                return auth;
        }
    });
    if (type === 'aside') {
        // 去除顶层 无用 label 显示
        return nodes.filter(({ nodePath, children }) => nodePath === '/' && !!(children === null || children === void 0 ? void 0 : children.length));
    }
    return nodes;
};
const store = {
    asideMenus: [],
    authRoutes: [],
};
// 可用权限
export const getAuthRoutes = () => {
    var _a;
    if ((_a = store.authRoutes) === null || _a === void 0 ? void 0 : _a.length) {
        return store.authRoutes;
    }
    store.authRoutes = filterRoutesConfig('route');
    return store.authRoutes;
};
// 侧边栏 展示菜单配置
export const getAsideMenus = () => {
    var _a;
    if ((_a = store.asideMenus) === null || _a === void 0 ? void 0 : _a.length) {
        return store.asideMenus;
    }
    store.asideMenus = filterRoutesConfig('aside');
    return store.asideMenus;
};
