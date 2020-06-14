/**
 * fix amis code by webpack loader
 */

import { staticLibDirPath } from '../constants'

export const editorFileReg = /[\\/]amis[\\/]lib[\\/]components[\\/]Editor\.js/
export const froalaEditorReg = /[\\/]amis[\\/]lib[\\/]components[\\/]RichText\.js/
export const factoryFileReg = /[\\/]amis[\\/]lib[\\/]factory\.js/

export const fixEditorLoader = ({ publicPath }: any) => ({
  loader: 'string-replace-loader', // transform amis editor worker files
  options: {
    search: 'function\\sfilterUrl\\(url\\)\\s\\{\\s*return\\s*url;',
    flags: 'm',
    replace: `function filterUrl(url) {return '${`${publicPath}${staticLibDirPath}/`}' + url.substring(1);`,
  },
})

// fix for hot update
export const fixFactoryLoader = () => ({
  loader: 'string-replace-loader',
  options: {
    multiple: [
      {
        // 添加 热跟新支持
        search: '\\~rendererNames\\.indexOf\\(config\\.name\\)',
        flags: 'm',
        replace: '!window.IS_WEBPACK_DEV_SERVER && ~rendererNames.indexOf(config.name)',
      },
      // {
      //   // 去掉多余的请求封装
      //   search: '\\? [a-zA-Z1-9_]*\\.wrapFetcher\\(options\\.fetcher\\)',
      //   flags: 'm',
      //   replace: '() => { console.log(123) }',
      // },
    ],
  },
})

// fix for "init" is not function
export const fixFroalaLoader = () => ({
  loader: 'string-replace-loader',
  options: {
    search: '\\.forEach\\(function \\(init\\) \\{ return init\\(\\); \\}\\)',
    flags: 'm',
    replace: '',
  },
})
