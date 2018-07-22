import 'url-polyfill';
import 'moment/locale/zh-cn';

import dva, { DvaOption, DvaInstance, Model } from 'dva';
import createLoading from 'dva-loading';

import createHistory from 'history/createBrowserHistory';
// import { createLogger } from 'redux-logger';
// import  config from 'config';

import { Extend } from './util/misc';

const initConfig: DvaOption = {
  history: createHistory(),
};

// if (config.env === 'local') {
//   initConfig.onAction = createLogger();
// }

export type ReduxSotre = {
  getState(arg: any): any;
  dispatch(arg: any): any;
  subscribe(listener: () => void): any;
  replaceReducer(nextReducer: any): any;
};

export type App = Extend<DvaInstance, {
  _store?: ReduxSotre;
  _models?: Model[];
}>;
const app: App = dva(initConfig);

export const getStore = (): ReduxSotre => {
  return app._store as ReduxSotre; // 强制转换
};

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./model/global.ts').default);

// 4. Router
app.router(require('./route').default);

// 5. Start
app.start('#root');

export default app._store;
