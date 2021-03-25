const fs = require('fs')
const validateOptions = require('schema-utils') // eslint-disable-line

const { winConst, dllVer } = require('../../constants')

const schema = {
  type: 'object',
  properties: {
    keepInMemory: {
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
    const { themeScript } = opts
    const requiredDllVer = `
      window.${winConst.dllRequireVer} = "${dllVer}";
    `

    const script = `
      <script>
      ${themeScript}
      ${requiredDllVer}
      </script>
    `

    return script.replace(/\n\s{2,}/g, '')
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync({ name: 'HtmlHooksPlugin' }, (_, done) => {
      const { getThemeScript, indexHtml, keepInMemory } = this.options

      const localFs = keepInMemory ? compiler.outputFileSystem : fs

      localFs.readFile(indexHtml, 'utf8', (readErr, content) => {
        if (readErr) {
          console.log(`Unable to read: ${indexHtml}`, readErr)
          return
        }

        const newContent = content.replace(
          '<script id="libScriptHolder"></script>',
          this.getInjectScript({
            themeScript: getThemeScript({ localFs }),
          })
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
