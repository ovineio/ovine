import { isUrl, Extend } from '../util/misc';
import { omit, map } from 'lodash';
import { Pathname } from 'history';
import { MenuData, MenuConfig, LimitConfig, ApiConfig } from '../config/menu';
import menuData from '../config/menu';
import { ACTION_DEF_NAME } from '../constant/misc';

export interface ExtraMenuConfig {
  key: string;
  path: Pathname;
}
type FormatteredMenuConfig = Extend<MenuConfig, ExtraMenuConfig>;
 // menuData 添加 parentPath/path ,key值
function formatter(data: MenuData, parentPath: string = '/'): FormatteredMenuConfig[] {
  return data.map(item => {
    let { path } = item;
    const key = path;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result: FormatteredMenuConfig = {
      ...item,
      path,
      key,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

export function getMenuAction(limit: Partial<LimitConfig> = {}, api: Partial<ApiConfig> = {} ): LimitConfig  {
  const omitKey: any = limit.omitKey || ['key', 'omitKey'];

  let result: any = {};
  map(omit(limit, omitKey), (v: any, k: string) => {
    const tmp: any = v;
    tmp.api = map(v.api, i => api[i]);
    if (ACTION_DEF_NAME[k] && !v.name) {
      tmp.name = ACTION_DEF_NAME[k];
    }
    result[k] = tmp;
  });

  result = {
    list: {
      name: ACTION_DEF_NAME.list,
      api: [api.list],
    },
    add: {
      name: ACTION_DEF_NAME.add,
      api: [api.add],
    },
    edit: {
      name: ACTION_DEF_NAME.edit,
      api: [api.edit],
    },
    del: {
      name: ACTION_DEF_NAME.del,
      api: [api.del],
    },
    ...result,
  };

  result = omit(result, omitKey);
  return result;
}

export function getMenuApi(api: Partial<ApiConfig> = {}): Partial<ApiConfig> {
  const key = api.key || '';
  const omitKey = api.omitKey || [];
  let result = api;
  if (key) {
    result = {
      list: `GET ${key}/list`,
      add: `POST ${key}/add`,
      edit: `POST ${key}/edit`,
      del: `POST ${key}/del`,
      ...api,
    };
  }
  omitKey.push('key', 'omitKey');
  result = omit(result, omitKey);
  return result;
}

export interface FlatedMenuConfig extends MenuConfig {
  api?: any;
  tabs?: any;
  key?: string;
}
export interface FlatedMenuData {
  [path: string]: FlatedMenuConfig;
}

export const flatedMenuData: FlatedMenuData = {};
const getFlatMenuData = (menus: MenuData, parent: Partial<MenuConfig> = {}): FlatedMenuData => {
  menus.forEach((item: MenuConfig) => {
    if (item.isTableView) {
      const api = getMenuApi({
        ...parent.api,
        ...item.api,
      });
      const info: FlatedMenuConfig = {
        ...item,
        api,
        limit: getMenuAction({
          ...parent.limit,
          ...item.limit,
        }, api),
      };
      if (parent.tabs && parent.children) {
        info.tabs = parent.children.map(i => i.path);
      }
      flatedMenuData[item.path] = info;

      if (item.children) {
        getFlatMenuData(item.children, item);
      }
    } else if (item.children) {
      flatedMenuData[item.path] = { ...omit(item, ['children']) };
      getFlatMenuData(item.children, item);
    } else {
      flatedMenuData[item.path] = item;
    }
  });
  return flatedMenuData;
};

export function getRouteMenuData(): FlatedMenuConfig {
  return flatedMenuData[location.pathname];
}

export const formaterMenuData = formatter(menuData);

getFlatMenuData(formaterMenuData);

console.info('formaterMenuData->', formaterMenuData);
console.info('flatedMenuData->', flatedMenuData);
