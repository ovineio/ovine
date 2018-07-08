import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { map } from 'lodash';
import { flatedMenuData } from './menu';
import { App } from '../index';

let routerDataCache: RouterData | undefined = undefined;

const modelNotExisted = (app: App, model: string): boolean => {
  // eslint-disable-next-line
  if (!app._models) {
    return false;
  }
  return !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });
};

// wrapper of dynamic
export const dynamicWrapper = (app: App, models: string[] = [], component: any ): any => {
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../model/${model}.ts`).default);
      }
    });
    return (props: any) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }

  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => require(`../model/${m}.ts`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw: any) => {
        const Component = raw.default || raw;
        return (props: any) =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

export type RouterType = {
  component: any;
  exact: boolean;
  path: string;
  key: string;
  name: string;
};
export interface RouterData {
    [path: string]: RouterType;
}
export const getRouterData = (app: App): RouterData => {
  const routerConfig: any = {
    '/': {
      component: dynamicWrapper(app, ['user'], () => import('../layout/basicLayout')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layout/userLayout')),
    },
  };

  // Get name from ./menu.js or just set it in the router data.
  map(flatedMenuData, (data, path) => {
    if (routerConfig[path]) {
      return;
    }

    const { isTableView = false, component, model = [], isExtraPath = false } = data;

    if (component) {
      routerConfig[path] = {
        exact: isExtraPath,
        component: dynamicWrapper(app, model, () => require(`../page/${component}.tsx`)),
      };
    } else if (isTableView) { // tablview routes
      routerConfig[path] = {
        exact: true,
        component: dynamicWrapper(app, ['tableview'], () => import('../page/tableView')),
      };
    }
  });
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData: any = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(flatedMenuData).find(key => pathRegexp.test(`${key}`));
    let menuItem: any = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = flatedMenuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
    };
    routerData[path] = router;
  });

  return routerData;
};
