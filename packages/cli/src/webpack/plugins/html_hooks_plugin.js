const fs = require('fs')
const _ = require('lodash')
const validateOptions = require('schema-utils') // eslint-disable-line

const { winConst, dllVer } = require('../../constants')

const schema = {
  type: 'object',
  properties: {
    scssUpdate: {
      type: 'boolean',
    },
    isProd: {
      type: 'boolean',
    },
    indexHtml: {
      type: 'string',
    },
    getThemeTpl: {
      instanceof: 'Function',
    },
  },
}

class HtmlHooksPlugin {
  // options = {}

  constructor(options = {}) {
    const check = _.isFunction(validateOptions) ? validateOptions : validateOptions.validate
    if (check) {
      check(schema, options, 'HtmlHooksPlugin')
    }
    this.options = options
  }

  getInjectTpl(opts) {
    const { scssUpdate, isProd } = this.options
    const { themeTpl } = opts

    const globalVer = `
      window.${winConst.dllRequireVer} = "${dllVer}";
      ${
        isProd
          ? ''
          : `
      window.IS_SCSS_UPDATE = ${scssUpdate};
      window.IS_WEBPACK_DEV_SERVER = true;
      `
      }
    `

    const script = `
      ${themeTpl.link}
      <script>
      ${globalVer}
      ${themeTpl.script}
      </script>
    `

    return script.replace(/\n\s{2,}/g, '')
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync({ name: 'HtmlHooksPlugin' }, (__, done) => {
      const { getThemeTpl, indexHtml, isProd } = this.options

      const localFs = !isProd ? compiler.outputFileSystem : fs
      const injectTpl = this.getInjectTpl({ themeTpl: getThemeTpl({ localFs }) })

      localFs.readFile(indexHtml, 'utf8', (readErr, content) => {
        if (readErr) {
          console.log(`Unable to read: ${indexHtml}`, readErr)
          return
        }

        const libHolder = '<script id="injectScriptHolder"></script>'

        if (content.indexOf(libHolder) === -1) {
          done()
          return
        }

        const newContent = content.replace(libHolder, injectTpl)
        localFs.writeFile(indexHtml, newContent, (writeErr) => {
          if (writeErr) {
            console.error(`Unable to write: ${indexHtml}`, writeErr)
          }
          done()
        })
      })
    })
  }
}

module.exports = HtmlHooksPlugin
