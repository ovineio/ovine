const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const WebpackBar = require('webpackbar')

function showError(arr) {
  arr.forEach((err) => {
    // fix: Errors appear duplicated with 'fork-ts-checker-webpack-plugin'
    if (!/TS\d*: /.test(err)) {
      console.log(`\n\n${err}`)
    }
  })
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
