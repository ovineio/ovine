/**
 * fix amis code by webpack loader
 */

import { dllVendorDirPath } from '../constants'

export const editorFileReg = /[\\/]amis[\\/]lib[\\/]components[\\/]Editor\.js/
export const videoFileReg = /[\\/]amis[\\/]lib[\\/]renderers[\\/]Video\.js/
export const froalaEditorReg = /[\\/]amis[\\/]lib[\\/]components[\\/]RichText\.js/
export const factoryFileReg = /[\\/]amis[\\/]lib[\\/]factory\.js/
export const apiUtilReg = /[\\/]amis[\\/]lib[\\/]utils[\\/]api\.js/
export const bootStropCss = /[\\/]bootstrap[\\/]dist[\\/]css[\\/]bootstrap.css/

const monacoVar = require('monaco-editor/package.json').version

export const fixEditorLoader = ({ publicPath }: any) => ({
  loader: 'string-replace-loader', // transform amis editor worker files
  options: {
    search: 'function\\sfilterUrl\\(url\\)\\s\\{\\s*return\\s*url;',
    flags: 'm',
    replace: `function filterUrl(url) {return '${`${publicPath}${dllVendorDirPath}`}' + url.slice(4, -2) + '${monacoVar}.js';`,
  },
})

// module replace
export const fixVideoLoader = () => ({
  loader: 'string-replace-loader', // transform amis editor worker files
  options: {
    multiple: [
      {
        search: ',\\sfunction\\s\\(Hls\\)\\s\\{',
        flags: 'm',
        replace: ', function (HlsModule) { var Hls = HlsModule.default;',
      },
      {
        search: ',\\sfunction\\s\\(flvjs\\)\\s\\{',
        flags: 'm',
        replace: ', function (flvModule) { var flvjs = flvModule.default;',
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
    function deprecated_isValidApi(api) {`,
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
        // 去掉多余的请求封装
        search: '\\? [a-zA-Z1-9_]*\\.wrapFetcher\\(options\\.fetcher\\)',
        flags: 'm',
        replace: '? options.fetcher ',
      },
      {
        // var react_1 = tslib_1.__importDefault(require("react"));
        search: 'var\\sreact_1\\s=\\stslib_1\\.__importDefault\\(require\\("react"\\)\\);',
        flags: 'm',
        replace: `
          var react_1 = tslib_1.__importDefault(require("react"));
          var react_dom_1 = require("react-dom");`,
      },
      {
        // SchemaRenderer.prototype.componentWillReceiveProps = function (nextProps) {
        search:
          'SchemaRenderer\\.prototype\\.componentWillReceiveProps\\s=\\sfunction\\s\\(nextProps\\)\\s{',
        flags: 'm',
        replace: `
          SchemaRenderer.prototype.componentDidMount = function () {
            var dataId = this.props.schema.$dataId;
            if (dataId && this.ref) {
              var $dom = react_dom_1.findDOMNode(this.ref);
              if ($dom) {
                $dom.dataset.id = dataId;
              }
            }
          };
          SchemaRenderer.prototype.componentWillReceiveProps = function (nextProps) {
            var props = this.props;
            if (props.schema.$dataId !== nextProps.schema.$dataId && this.ref) {
              var $dom = react_dom_1.findDOMNode(this.ref);
              if (!$dom) {
                return
              }
              if (nextProps.schema.$dataId) {
                $dom.dataset.id = nextProps.schema.$dataId;
              } else {
                  delete $dom.dataset.id;
              }
            }
        `,
      },
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
