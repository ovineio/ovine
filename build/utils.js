const path = require('path')

const {
  ENV = 'development', // 判断代码是否打包
  API_ENV = 'localhost', // 判断接口请求环境
  PORT = 7050, // dev server 端口配置
  ANALYZER = false, // 是否开启打包分析
  ANALYZER_PORT, // 打包分析代码端口
  MOCK = false,
} = process.env

process.env.NODE_ENV = ENV

const isDev = ENV === 'development'
const isProd = ENV === 'production'
const enableAnalyzer = ANALYZER === 'true'
const enableMock = MOCK === 'true' || !isProd

const rootDir = (p = '') => path.join(__dirname, '../', p)
const distDir = (p = '') => rootDir(`dist/${p}`)
const srcDir = (p = '') => rootDir(`src/${p}`)

// 发布时，需要要将静态资源部署到其他位置时设置,必须以 '/' 结尾
const publicPath = '/'

// dll 相关文件配置
// build 目录下的两个xx.json文件 是自动生成的 无需手动修改
const manifestPath = rootDir('build/dll_vendor_manifest.json')
const manifestAssetsName = 'build/dll_vendor_assets.json'
const dllVendorJsPath = 'static/dll'

const getDllDistPath = (type) =>
  `${publicPath}${dllVendorJsPath}/${require(rootDir(manifestAssetsName)).dll_vendor[type]}`

const dllVendorCss = getDllDistPath('css')
const dllVendorJs = getDllDistPath('js')

const dllPaths = {
  manifestPath,
  manifestAssetsName,
  dllVendorJsPath,
  dllVendorJs,
  dllVendorCss,
}

const replaceUrlPath = (resourcePath) => {
  if (isDev) {
    return '[path][name].[ext]'
  }

  // 去除无用文件夹 并添加 hash
  return (resourcePath) => {
    const filePath = resourcePath
      .replace(srcDir('assets'), '')
      .replace(srcDir(), '')
      .replace('/images', '')
    return `assets/${path.dirname(filePath)}/[name]_[contenthash:6].[ext]`
  }
}

module.exports = {
  ENV,
  API_ENV,
  PORT,
  ANALYZER_PORT: ANALYZER_PORT || PORT + 1,
  enableMock,
  enableAnalyzer,
  isDev,
  isProd,
  distDir,
  srcDir,
  rootDir,
  replaceUrlPath,
  publicPath,
  dllPaths,
}
