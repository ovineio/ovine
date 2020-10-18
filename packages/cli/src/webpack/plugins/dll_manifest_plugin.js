const fse = require('fs-extra')
const _ = require('lodash')
const validateOptions = require('schema-utils') // eslint-disable-line

const constants = require('../../constants')

const schema = {
  type: 'object',
  properties: {
    siteDir: {
      type: 'string',
    },
  },
}

class DllManifestPlugin {
  constructor(options = {}) {
    validateOptions(schema, options, 'DllManifestPlugin')
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync({ name: 'DllManifestPlugin' }, (__, done) => {
      const jsonFiles = []

      const getFilePath = (fileKey) =>
        `${this.options.siteDir}/${constants.dllManifestFile.replace('[name]', fileKey)}`

      const onLoadFiles = () => {
        if (jsonFiles.length < 3) {
          return
        }

        const entryJson = {}
        const dllContents = []
        jsonFiles.forEach((i) => {
          if (i.key === constants.dllVendorFileName) {
            entryJson.name = _.get(i, 'content.name')
          }
          dllContents.push(_.get(i, 'content.content'))
        })

        entryJson.content = dllContents.reduce((sum, item) => _.assign({}, sum, item))
        constants.dllFileKeys.forEach((fileKey) => {
          fse.removeSync(getFilePath(fileKey))
        })

        fse.writeJSONSync(getFilePath(constants.dllVendorFileName), entryJson)

        done()
      }

      constants.dllFileKeys.forEach((fileKey) => {
        fse.readJSON(getFilePath(fileKey), 'utf-8').then((jsonContent) => {
          jsonFiles.push({
            key: fileKey,
            content: jsonContent,
          })
          onLoadFiles()
        })
      })
    })
  }
}

module.exports = DllManifestPlugin
