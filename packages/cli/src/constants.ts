// lib

export const libName = 'ovine'
export const libRootPath = `/${libName}`
export const libVer = require('../package.json').version

export const amisEditorVer = '3.0.6'
// publish_mark 如果当前升级不需要更新 dll,需要指定特定DLL版本,默认和版本号一致
export const dllVer = libVer
export const winConst = {
  dllPath: 'OVINE_DLL_PATH',
  dllVersion: 'OVINE_DLL_VERSION',
  dllRequireVer: 'OVINE_DLL_REQUIRE_VER',
}

export const domain = {
  jsdelivr: 'https://cdn.jsdelivr.net/',
  libDoc: 'https://ovine.igroupes.com/',
}

// basic
export const defaultPort = 7050
export const srcDirName = 'src'
export const outDirName = 'dist'
export const staticDirName = 'static'
export const configFileName = `${libName}.config.js`
export const generatedDirName = `.${libName}`
export const staticLibDirPath = `${staticDirName}/${libName}`

// scss
export const stylesDirName = 'styles'
export const scssDirName = 'scss'
export const cssAssetsName = 'css_assets'
export const cssAssetsFile = `${generatedDirName}/${cssAssetsName}.json`

// dll config
export const dllVendorFileName = 'dll_entry'
export const dllChunkFilePrefix = 'dll_chunk_'
export const dllFileKeys = ['boot', 'amis', dllVendorFileName]
export const dllDirName = `dll/${dllVer}`
export const dllVendorDirPath = `${staticLibDirPath}/${dllDirName}`
export const dllDirPath = `${generatedDirName}/${staticDirName}/${dllDirName}`
export const dllManifestFile = `${generatedDirName}/[name]_manifest.json`
export const dllAssetsFile = `${generatedDirName}/[name]_assets.json`
export const dllJsdelivrHostDir = `${domain.jsdelivr}npm/@${libName}/init@${dllVer}/env/${dllDirPath}/`

// config files
export const webpackConfFileName = 'webpack.config.js'
export const webpackDllConfFileName = 'webpack.dll.js'
export const esLintFileName = '.eslintrc.js'
export const tsLintConfFileName = 'tslint.json'
export const tsConfFileName = 'tsconfig.json'
export const babelConfigFileName = 'babel.config.js'
