const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const WebpackBar = require('webpackbar')

function showError(arr) {
  console.log(`\n\n${arr.join('')}`)
}

class LogPlugin extends WebpackBar {
  apply(compiler) {
    super.apply(compiler)

    compiler.hooks.done.tap('WebpackNiceLog', (stats) => {
      if (stats.hasErrors()) {
        const messages = formatWebpackMessages(stats.toJson('errors-only', true))
        if (messages.errors.length) {
          showError(messages.errors)
        }
      }
    })
  }
}

module.exports = LogPlugin
