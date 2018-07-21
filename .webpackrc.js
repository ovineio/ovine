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


const proxy = {
  '/api/*': {
    target: 'http://dev.rt-admin.com/api',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  },
};

if (NODE_ENV === 'development') {
  config.devtool = 'development';
}

config.proxy = API_ENV === 'local' ? {} : proxy;

export default config;
