const fs = require('fs')
const validateOptions = require('schema-utils')

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
  options = {}

  constructor(options = {}) {
    validateOptions(schema, options, 'HtmlHooksPlugin')
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync({ name: 'HtmlHooksPlugin' }, (_, done) => {
      const { getThemeScript, indexHtml, keepInMemory } = this.options

      const localFs = keepInMemory ? compiler.outputFileSystem : fs

      localFs.readFile(indexHtml, 'utf8', function(readErr, content) {
        if (readErr) {
          console.log(`Unable to read: ${indexHtml}`, readErr)
          return
        }
        const newContent = content.replace(
          '<script id="themeScript"></script>',
          getThemeScript({ localFs })
        )
        localFs.writeFile(indexHtml, newContent, function(writeErr) {
          if (writeErr) {
            console.log(`Unable to write: ${indexHtml}`, writeErr)
          }
          done()
        })
      })
    })
  }
}

module.exports = HtmlHooksPlugin
