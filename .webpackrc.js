const ENV = process.env.ENV || 'local';
const IS_MOCK = !!process.env.MOCK;

const config = {
  entry: 'src/index.ts',
  devtool: 'eval',
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
  define: {
    'ENV': ENV,
    'IS_MOCK': IS_MOCK,
    'process.env.NODE_ENV': ENV === 'local' ? 'development' : 'production',
  },
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

config.proxy = IS_MOCK ? {} : proxy;

export default config;
