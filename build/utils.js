const path = require('path')

const {
  ENV = 'development', // 判断代码是否打包
  API_ENV = 'localhost', // 判断接口请求环境
  PORT = 7050, // dev server 端口配置
  ENABLE_ANALYZER = false, // 是否开启打包分析
  ANALYZER_PORT, // 打包分析代码端口
} = process.env

const isDev = ENV === 'development'
const isProd = ENV === 'production'
const enableAnalyzer = ENABLE_ANALYZER === 'true'

const rootDir = (p = '') => path.resolve(__dirname, '../', p)
const distDir = (p = '') => rootDir(`dist/${p}`)
const srcDir = (p = '') => rootDir(`src/${p}`)

const manifestPath = rootDir('build/dll_vendor_manifest.json')
const manifestAssetsName = 'build/dll_vendor_assets.json'
const dllVendorJsPath = 'static/js'
const dllVendorJs = () =>
  `/${dllVendorJsPath}/${require(rootDir(manifestAssetsName)).dll_vendor.js}`

module.exports = {
  ENV,
  API_ENV,
  PORT,
  ANALYZER_PORT: ANALYZER_PORT || PORT + 1,
  enableAnalyzer,
  isDev,
  isProd,
  distDir,
  srcDir,
  rootDir,
  dllVendorJs,
  dllVendorJsPath,
  manifestPath,
  manifestAssetsName,
}
