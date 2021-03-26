const fs = require('fs')
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
    getThemeScript: {
      instanceof: 'Function',
    },
  },
}

class HtmlHooksPlugin {
  // options = {}

  constructor(options = {}) {
    validateOptions(schema, options, 'HtmlHooksPlugin')
    this.options = options
  }

  getInjectScript(opts) {
    const { scssUpdate, isProd } = this.options
    const { themeScript } = opts

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
      <script>
      ${themeScript}
      ${globalVer}
      </script>
    `

    return script.replace(/\n\s{2,}/g, '')
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync({ name: 'HtmlHooksPlugin' }, (_, done) => {
      const { getThemeScript, indexHtml, isProd } = this.options

      const localFs = !isProd ? compiler.outputFileSystem : fs
      const themeScript = getThemeScript({ localFs })

      localFs.readFile(indexHtml, 'utf8', (readErr, content) => {
        if (readErr) {
          console.log(`Unable to read: ${indexHtml}`, readErr)
          return
        }

        const newContent = content.replace(
          '<script id="injectScriptHolder"></script>',
          this.getInjectScript({ themeScript })
        )

        localFs.writeFile(indexHtml, newContent, function(writeErr) {
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
