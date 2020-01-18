const path = require('path')

const {
  ENV = 'development', // 判断代码是否打包
  API_ENV = 'localhost', // 判断接口请求环境
  PORT = 7050, // dev server 端口配置
  ANALYZER = false, // 是否开启打包分析
  ANALYZER_PORT, // 打包分析代码端口
} = process.env

const isDev = ENV === 'development'
const isProd = ENV === 'production'
const enableAnalyzer = ANALYZER === 'true'

const rootDir = (p = '') => path.join(__dirname, '../', p)
const distDir = (p = '') => rootDir(`dist/${p}`)
const srcDir = (p = '') => rootDir(`src/${p}`)

const manifestPath = rootDir('build/dll_vendor_manifest.json')
const manifestAssetsName = 'build/dll_vendor_assets.json'
const dllVendorJsPath = 'static/js'
const dllVendorJs = `/${dllVendorJsPath}/${require(rootDir(manifestAssetsName)).dll_vendor.js}`

const replaceUrlPath = (resourcePath) => {
  // 去除无用文件夹
  const path = resourcePath
    .replace(`${__dirname}/src/assets`, '')
    .replace(`${__dirname}/src`, '')
    .replace('/images', '')
  return `assets${path}`
}

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
  replaceUrlPath,
  dllPaths: {
    manifestPath,
    manifestAssetsName,
    dllVendorJsPath,
    dllVendorJs,
  },
}
