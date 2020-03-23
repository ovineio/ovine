/**
 * App 全局 menus 配置
 */
import { mapTree } from 'amis/lib/utils/helper';
import { cloneDeep, last } from 'lodash';
let routesConfig = [];
// 解析配置的路由数据
// 1. 根据 nodePath 生成默认 path 路径值
const resolveRouteConfig = (nodes) => {
    return mapTree(nodes, (item, _, __, itemNodes) => {
        var _a;
        const { path, nodePath, children, pathToComponent } = item;
        item.nodePath = `${((_a = last(itemNodes)) === null || _a === void 0 ? void 0 : _a.nodePath) || ''}/${nodePath}`.replace(/(\/\/)/g, '/');
        if (!path && (pathToComponent || (!children && !pathToComponent))) {
            item.path = item.nodePath;
        }
        return item;
    });
};
export function setRoutesConfig(routes) {
    routesConfig = resolveRouteConfig(routes);
    return routesConfig;
}
// 防止修改原始数据
export function getRouteConfig(fresh) {
    if (fresh) {
        return cloneDeep(routesConfig);
    }
    return routesConfig;
}
