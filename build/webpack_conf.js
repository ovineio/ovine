const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const utils = require('./utils')
const babelConfig = require('./babel_conf')
const plugins = require('./plugins')
const optimization = require('./optimization')

const {
  ENV,
  PORT,
  enableAnalyzer,
  srcDir,
  distDir,
  rootDir,
  isDev,
  isProd,
  replaceUrlPath,
  publicPath,
} = utils

const cacheLoader = {
  loader: 'cache-loader',
  options: {
    cacheDirectory: rootDir('.cache'),
  },
}

const babelLoader = {
  loader: 'babel-loader',
  options: babelConfig,
}

const webpackConfig = {
  plugins,
  optimization,
  mode: ENV,
  bail: true,
  devtool: enableAnalyzer ? false : isProd ? 'nosources-source-map' : 'eval',
  entry: srcDir('index.tsx'),
  output: {
    publicPath,
    path: distDir(),
    filename: 'index_[hash:6].js',
    chunkFilename: 'chunk/[name]_[chunkhash:6].js',
    pathinfo: false,
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: [cacheLoader, babelLoader],
        exclude: /node_modules/,
      },
      {
        test: /\.ts|tsx$/,
        use: [
          cacheLoader,
          { loader: 'thread-loader' },
          babelLoader,
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [cacheLoader, isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.png|jpg|gif|ttf|woff|woff2|eot|svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              publicPath,
              limit: 2000, // 低于2K 使用 base64
              name: replaceUrlPath,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '~': srcDir(),
    },
  },
  devServer: {
    publicPath,
    port: PORT,
    host: '0.0.0.0',
    inline: true,
    contentBase: distDir(),
    watchContentBase: true,
    overlay: true,
    hot: true,
    historyApiFallback: true,
    open: true,
    useLocalIp: true,
    disableHostCheck: true,
    // 不同 域名下 触发浏览器自动更新 https://github.com/webpack/webpack-dev-server/issues/533
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    stats: {
      all: false,
      timings: true,
      errors: true,
      colors: true,
      warnings: true,
      // our additional options
      moduleTrace: true,
      errorDetails: true,
    },
  },
  performance: {
    maxEntrypointSize: 600 * 1000, // 入口包大小超过600k报警
    maxAssetSize: 400 * 1000, // 单个包大小超过400k报警
  },
  stats: {
    chunkModules: false,
    assets: false,
  },
}

module.exports = webpackConfig
