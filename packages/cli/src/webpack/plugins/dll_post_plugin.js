const fse = require('fs-extra')
const glob = require('glob')
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
    validateOptions(schema, options, 'DllPostPlugin')
    this.options = options
  }

  applyManifestJson(done) {
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
  }

  applyVendorEntry(done) {
    const dllDir = `${this.options.siteDir}/${constants.dllDirPath}`
    glob(`${dllDir}/${constants.dllVendorFileName}_*.js`, (err, files) => {
      if (err) {
        console.log('apply dll vendor file error.')
        throw err
      }

      const vendor = files[0]
      if (!fse.existsSync(vendor)) {
        return
      }

      fse.readFile(vendor, 'utf8', function(readErr, content) {
        if (readErr) {
          console.log(`Unable to read: ${vendor}`, readErr)
          return
        }

        // rewrite CSS,JS chunk files url
        const newContent = content
          .replace(
            /var vendor_(\w{6})=function\(e\)\{/m,
            'var vendor_$1=function(e){function getPath(){ var _path = ""; try {throw new Error()} catch (e) {var info = e.stack.match(/\\((?:https?|file):.*\\)/);if(info) { var temp = info[0]; _path = temp.slice(1, temp.lastIndexOf("/"));}} return _path + "/"; }'
          )
          .replace(/\+"\.css",(\w{1})=.{3}\+/m, '+".css",$1=getPath()+')
          .replace(
            /function\(e\)\{return .{3}\+"chunk_"/m,
            'function(e){ return getPath()+"chunk_"'
          )

        fse.writeFile(vendor, newContent, (writeErr) => {
          if (writeErr) {
            console.log(`Unable to write: ${vendor}`, writeErr)
            return
          }
          done()
        })
      })
    })
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync({ name: 'DllPostPlugin' }, (__, done) => {
      const taskStatus = []
      const doneTask = () => {
        taskStatus.push(true)
        if (taskStatus.length === 2) {
          done()
        }
      }

      this.applyManifestJson(doneTask)
      this.applyVendorEntry(doneTask)
    })
  }
}

module.exports = DllManifestPlugin
