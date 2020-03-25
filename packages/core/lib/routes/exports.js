/**
 * 路由相关工具函数
 * 所有异步加载文件
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app } from "../app";
import { isSubStr, retryPromise } from "../utils/tool";
// 计算 路由 path
export function getRoutePath(path) {
    return `${app.constants.baseUrl || '/'}${currPath(path)}`;
}
// 获取pages内组件文件在项目内的物理路径，用于 webpack 懒加载文件与打包
export function getPageFilePath(option) {
    const { pathToComponent, path = '' } = option;
    const componentPath = typeof pathToComponent === 'string' ? pathToComponent : getRoutePath(path);
    return currPath(componentPath);
}
// 获取 页面预设值。默认为  pages/xxx/preset.ts 该文件是权限设置必须文件
export function getPagePreset(option) {
    const filePath = getPageFilePath(option);
    try {
        const pagePest = require(/* webpackInclude: /pages[\\/].*[\\/]preset\.[t|j]s$/ */ 
        /* webpackChunkName: "prest_[request]" */
        `~/pages/${filePath}/preset`);
        return pagePest.default;
    }
    catch (e) {
        //
    }
    return undefined;
}
// 获取 mock。默认为  pages/xxx/mock.ts 存在该文件，将自动注入mock到prest每一个 api
export function getPageMockSource(option) {
    const filePath = getPageFilePath(option);
    try {
        const pagePest = require(/* webpackInclude: /pages[\\/].*[\\/]mock\.[t|j]s$/ */ 
        /* webpackChunkName: "mock_[request]" */
        `~/pages/${filePath}/mock`);
        return pagePest.default;
    }
    catch (e) {
        //
    }
    return undefined;
}
// 异步获取主题 css 文件
export function getThemeCssAsync(theme) {
    return __awaiter(this, void 0, void 0, function* () {
        return import(
        /* webpackChunkName: "theme_[request]" */
        `@generated/styles/themes/${theme}.css`);
    });
}
// 异步获取页面文件
export function getPageFileAsync(option) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = getPageFilePath(option);
        return retryPromise(() => import(
        /* webpackInclude: /pages[\\/].*[\\/]index\.[t|j]sx?$/ */
        /* webpackChunkName: "page_[request]" */
        `~/pages/${filePath}`));
    });
}
// 获取 nodePath
export function getNodePath(option) {
    const { nodePath } = option;
    const filePath = getPageFilePath(option);
    return nodePath || filePath ? `/${filePath}` : '';
}
// 当前路径,去除多余前缀/,保持一致性  /login ==> login
export function currPath(path, defaultPath = '') {
    if (!path) {
        return defaultPath;
    }
    if (path === '/') {
        return defaultPath;
    }
    return !isSubStr(path, '/', 0) ? path : path.substring(1);
}
