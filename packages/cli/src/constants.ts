export const libName = 'ovine'
export const libRootPath = '/ovine'
export const outDirName = 'dist'
export const defaultPort = 7050

export const srcDirName = 'src'
export const staticDirName = 'static'
export const configFileName = `${libName}.config.js`
export const generatedDirName = `.${libName}`
export const staticLibDirPath = `${staticDirName}/${libName}`

// scss
export const stylesDirName = 'styles'
export const scssDirName = 'scss'
export const libThemes = ['default', 'cdx', 'dark']
export const cssAssetsFile = `${generatedDirName}/css_assets.json`

// dll config
export const dllVendorFileName = 'vendor'
export const dllVendorDirPath = `${staticLibDirPath}/dll`
export const dllDirPath = `${generatedDirName}/${staticDirName}/dll`
export const dllManifestFile = `${generatedDirName}/dll_manifest.json`
export const dllAssetsFile = `${generatedDirName}/dll_assets.json`

// config files
export const webpackConfFileName = 'webpack.config.js'
export const webpackDllConfFileName = 'webpack.dll.js'
export const esLintFileName = '.eslintrc.js'
export const tsLintConfFileName = 'tslint.json'
export const tsConfFileName = 'tsconfig.json'
export const babelConfigFileName = 'babel.config.js'
