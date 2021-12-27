/**
 * fix amis lib code by "string-replace-loader" of webpack
 */

import { dllJsdelivrHostDir } from '../constants'
import { getModulePath } from '../utils'

const fs = require('fs')

export const editorFileReg = /[\\/]amis[\\/]lib[\\/]components[\\/]Editor\.js/
export const chartFileReg = /[\\/]amis[\\/]lib[\\/]renderers[\\/]Chart\.js/
export const froalaEditorReg = /[\\/]amis[\\/]lib[\\/]components[\\/]RichText\.js/
export const factoryFileReg = /[\\/]amis[\\/]lib[\\/]factory\.js/
export const apiUtilReg = /[\\/]amis[\\/]lib[\\/]utils[\\/]api\.js/
export const bootStropCss = /[\\/]bootstrap[\\/]dist[\\/]css[\\/]bootstrap.css/
export const fontAwesomeCss = /[\\/]font-awesome[\\/]css[\\/]font-awesome.css/

function base64Encode(file) {
  const bitmap = fs.readFileSync(file)
  return Buffer.from(bitmap, 'utf-8').toString('base64')
}

export const fixEditorLoader = () => ({
  loader: 'string-replace-loader', // transform amis editor worker files
  options: {
    search: 'window\\.MonacoEnvironment = \\{',
    flags: 'm',
    replace: 'window.__deprecated_MonacoEnvironment = {',
  },
})

// module replace
export const fixChartLoader = () => ({
  loader: 'string-replace-loader', // transform amis editor worker files
  options: {
    multiple: [
      {
        search: 'if \\(chartTheme\\) \\{',
        flags: 'm',
        replace: `if (chartTheme) { delete chartTheme.backgroundColor;
        `,
      },
    ],
  },
})

// fix for isValidApi func
export const fixApiUtilLoader = () => ({
  loader: 'string-replace-loader',
  options: {
    search: 'function\\sisValidApi\\(api\\)\\s\\{',
    flags: 'm',
    replace: `function isValidApi(api) { return typeof api === "string" }
    function __deprecated_isValidApi(api) {`,
  },
})

// fix amis factory
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
      {
        // AMIS全局统一 默认 ENV 环境
        search: ', options, pathPrefix\\) \\{',
        flags: 'm',
        replace: `, opts, pathPrefix) {
          var options = tslib_1.__assign(window.OVINE_AMIS_ENV, opts);
        `,
      },
      {
        // 去掉多余的请求封装===>!!amis源码修改后，很有可能出错的地方
        search: '\\? .*\\.wrapFetcher\\)\\(options\\.fetcher, options.tracker\\)',
        flags: 'm',
        replace: '? options.fetcher ',
      },
      // {
      //   // var react_1 = tslib_1.__importDefault(require("react"));
      //   search: 'var\\sreact_1\\s=\\stslib_1\\.__importDefault\\(require\\("react"\\)\\);',
      //   flags: 'm',
      //   replace: `
      //     var react_1 = tslib_1.__importDefault(require("react"));
      //     var react_dom_1 = require("react-dom");`,
      // },
      // {
      //   // SchemaRenderer.prototype.componentWillReceiveProps = function (nextProps) {
      //   search:
      //     'SchemaRenderer\\.prototype\\.componentWillReceiveProps\\s=\\sfunction\\s\\(nextProps\\)\\s{',
      //   flags: 'm',
      //   replace: `
      //     SchemaRenderer.prototype.componentDidMount = function () {
      //       var dataId = this.props.schema.$dataId;
      //       if (dataId && this.ref) {
      //         var $dom = react_dom_1.findDOMNode(this.ref);
      //         if ($dom) {
      //           $dom.dataset.id = dataId;
      //         }
      //       }
      //     };
      //     SchemaRenderer.prototype.componentWillReceiveProps = function (nextProps) {
      //       var props = this.props;
      //       if (props.schema.$dataId !== nextProps.schema.$dataId && this.ref) {
      //         var $dom = react_dom_1.findDOMNode(this.ref);
      //         if (!$dom) {
      //           return
      //         }
      //         if (nextProps.schema.$dataId) {
      //           $dom.dataset.id = nextProps.schema.$dataId;
      //         } else {
      //             delete $dom.dataset.id;
      //         }
      //       }
      //   `,
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

// a:not[href] is not good.
export const fixBootStropCss = () => ({
  loader: 'string-replace-loader',
  options: {
    multiple: [
      {
        search: 'a\\:not\\(\\[href\\]\\)',
        flags: 'gm',
        replace: '.ignore-anothref',
      },
      {
        search: 'svg \\{',
        flags: 'gm',
        replace: '.ignore-svg {',
      },
    ],
  },
})

export const fixFontAwesomeCss = ({ siteDir, embedAssets }: any) => {
  const cdnFaPath = `${dllJsdelivrHostDir}dll_fontawesome-webfont`

  const base64FaStr = `url('data:application/x-font-woff2;charset=utf-8;base64,${base64Encode(
    getModulePath(siteDir, 'font-awesome/fonts/fontawesome-webfont.woff2', true)
  )}') format('woff2')`

  const config = {
    loader: 'string-replace-loader',
    options: {
      multiple: [
        {
          search: 'src: url\\(.*\\);',
          flags: 'gm',
          replace: '',
        },
        {
          search: '@font-face \\{',
          flags: 'gm',
          replace: `@font-face {src: url(../fonts/fontawesome-webfont.eot), url(${cdnFaPath}.eot);
            src: url(../fonts/fontawesome-webfont.eot?#iefix) format('embedded-opentype'), url(${cdnFaPath}.eot?#iefix) format('embedded-opentype'), ${
            embedAssets
              ? `${base64FaStr}, `
              : `url(../fonts/fontawesome-webfont.woff2) format('woff2'), url(${cdnFaPath}.woff2) format('woff2'), `
          }url(../fonts/fontawesome-webfont.woff) format('woff'), url(${cdnFaPath}.woff) format('woff'), url(../fonts/fontawesome-webfont.ttf) format('truetype'), url(${cdnFaPath}.ttf) format('truetype'), url(../fonts/fontawesome-webfont.svg#fontawesomeregular) format('svg'), url(${cdnFaPath}.svg#fontawesomeregular) format('svg');
            font-family: 'FontAwesome';
            font-weight: normal;
            font-style: normal;
          }
          .ignore-font-face {
          `,
        },
      ],
    },
  }

  return config
}
