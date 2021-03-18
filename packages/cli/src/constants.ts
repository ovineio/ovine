// lib
export const libName = 'ovine'
export const libRootPath = `/${libName}`
export const libVer = require('../package.json').version

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
export const cssAssetsFile = `${generatedDirName}/css_assets.json`

// dll config
export const dllVendorFileName = 'dll_entry'
export const dllChunkFilePrefix = 'dll_chunk_'
export const dllFileKeys = ['boot', 'amis', dllVendorFileName]
export const dllDirName = `dll/${libVer}`
export const dllVendorDirPath = `${staticLibDirPath}/${dllDirName}`
export const dllDirPath = `${generatedDirName}/${staticDirName}/${dllDirName}`
export const dllManifestFile = `${generatedDirName}/[name]_manifest.json`
export const dllAssetsFile = `${generatedDirName}/[name]_assets.json`

// config files
export const webpackConfFileName = 'webpack.config.js'
export const webpackDllConfFileName = 'webpack.dll.js'
export const esLintFileName = '.eslintrc.js'
export const tsLintConfFileName = 'tslint.json'
export const tsConfFileName = 'tsconfig.json'
export const babelConfigFileName = 'babel.config.js'
