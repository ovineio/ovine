/**
 * fix amis code by webpack loader
 */

import { staticLibDirPath } from '../constants'

export const editorFileReg = /[\\/]amis[\\/]lib[\\/]components[\\/]Editor\.js/
export const factoryFileReg = /[\\/]amis[\\/]lib[\\/]factory\.js/

export const fixEditorLoader = ({ publicPath }: any) => ({
  loader: 'string-replace-loader', // transform amis editor worker files
  options: {
    search: 'function\\sfilterUrl\\(url\\)\\s\\{\\s*return\\s*url;',
    flags: 'm',
    replace: `function filterUrl(url) {return '${`${publicPath}${staticLibDirPath}/`}' + url.substring(1);`,
  },
})

export const fixFactoryLoader = () => ({
  loader: 'string-replace-loader',
  options: {
    search: '\\~rendererNames\\.indexOf\\(config\\.name\\)',
    flags: 'm',
    replace: '!window._isWebpackDevServer && ~rendererNames.indexOf(config.name)',
  },
})
