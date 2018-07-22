const path = require('path');

const API_ENV = process.env.API_ENV || 'local';
const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  entry: 'src/index.ts',
  alias: {
    config: path.resolve(__dirname, `src/config/env/${API_ENV}.ts`),
  },
  extraBabelPlugins: [
    [ 'import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      }, 'antd'
    ],
    [ 'import', {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      }, 'lodash'
    ],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  publicPath: '/',
  disableDynamicImport: true,
  hash: true,
};

if (NODE_ENV === 'development') {
  config.devtool = 'cheap-module-eval-source-map';

  const apiProxyConfig = { // env server map
    local: 'http://localhost:8021',
    develop: 'http://dev-rtadmin.com',
    production: 'http://rtadmin.com',
  };

  config.proxy = {
    '/api/*': {
      target: apiProxyConfig[API_ENV] || `http://${API_ENV}-rtadmin.com`,
      changeOrigin: true,
    },
  };
}

export default config;
