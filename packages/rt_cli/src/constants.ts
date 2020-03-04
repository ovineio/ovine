export const libName = 'rtadmin'
export const outDirName = 'dist'
export const defaultPort = 7050

export const configFileName = `${libName}.config.js`
export const generatedDirName = `.${libName}`
export const srcDirName = 'src'
export const staticDirName = 'static'
export const staticLibDirName = `${staticDirName}/${libName}`
export const themesDirName = `${generatedDirName}/themes`

// dll config
export const dllVendorDirName = `${staticLibDirName}/dll`
export const dllVendorFileName = 'vendor'
export const dllDirName = `${generatedDirName}/${staticDirName}/dll`
export const dllManifestName = `${generatedDirName}/dll_manifest.json`
export const dllAssetsName = `${generatedDirName}/dll_assets.json`

// config files
export const webpackConfFileName = 'webpack.config.js'
export const webpackDllConfFileName = 'webpack.dll.js'
export const esLintFileName = '.eslintrc.js'
export const tsLintConfFileName = 'tslint.json'
export const tsConfFileName = 'tsconfig.json'
export const babelConfigFileName = 'babel.config.js'
