import * as React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';

import { History } from 'history';
import styles from '../asset/style/global.less';
import Authorized from '../util/authorized';
import { getRouterData } from './router';
import { App } from '../index';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

// if (process.env.NODE_ENV !== 'production') {
// const { whyDidYouUpdate } = require('why-did-you-update');
// whyDidYouUpdate(React);
// // }

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }: {
  history: History;
  app: App;
}) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <AuthorizedRoute
            path="/"
            authority={null}
            redirectPath="/user/login"
            render={props => <BasicLayout {...props} />}
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
