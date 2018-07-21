export interface LimitConfig {
  [key: string]: { // 权限验证key
    api?: string[]; // 该权限需要的后台api, 没有api配置表示纯前端限制
    name?: string; // 权限名称
    omitKey?: string[]; // 需要删除的key
  };
}

export interface ApiConfig {  // 后端接口配置
  key: string; // rest key值，自动生成增删改查
  omitKey: string[]; // 需要过滤的一些操作
  [key: string]: string | string[]; // 其他 api
}

export interface SideMenuConfig {
  isTableView?: boolean; // 是否是TableView
  isHideInMenu?: boolean; // 是否在侧边栏隐藏
  tabs?: boolean; // 是否是 tabs 表页
  limit?: LimitConfig; // 权限验证配置
  api?: ApiConfig;
  isExtraPath?: boolean;
}

export interface BaseMenuConfig {
  path: string; // 路径 key
  name?: string; // 当前打开路径的 页面名称
  component?: string | true; // 组件路径
  model?: string[]; // z组件需要的model
  icon?: string; // 侧边栏
}

export interface MenuConfig extends SideMenuConfig, BaseMenuConfig {
  children?: MenuConfig[];
}

export type MenuData = MenuConfig[];

declare const menuData: MenuData;
export default menuData;
