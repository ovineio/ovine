/**
 * After the dll build is complete, there are some tasks that need to be done
 */
const chalk = require('chalk')
const fse = require('fs-extra')
const glob = require('glob')
const _ = require('lodash')
const path = require('path')
const validateOptions = require('schema-utils') // eslint-disable-line

const constants = require('../../constants')
const { getDllManifestFile } = require('../../utils')

const {
  dllVendorFileName,
  dllManifestFile,
  dllFileKeys,
  generatedDirName,
  staticDirName,
  dllDirPath,
  winConst,
  dllVer,
} = constants

const schema = {
  type: 'object',
  properties: {
    withHash: {
      type: 'boolean',
    },
    siteDir: {
      type: 'string',
    },
  },
}

class DllManifestPlugin {
  constructor(options = {}) {
    const check = _.isFunction(validateOptions) ? validateOptions : validateOptions.validate
    if (check) {
      check(schema, options, 'DllPostPlugin')
    }

    const { siteDir } = options

    this.options = options
    this.compute = {
      getManifestPath: (fileKey) => `${siteDir}/${dllManifestFile.replace('[name]', fileKey)}`,
      dllDir: `${siteDir}/${dllDirPath}`,
      ...getDllManifestFile(siteDir),
    }
  }

  copyJsonFilesToDllDir(done) {
    const { dllDir, manifestFile, assetsFile } = this.compute
    const srcFiles = [manifestFile, assetsFile]

    Promise.all(
      srcFiles.map((srcFile) => {
        return fse.copy(srcFile, `${dllDir}/${path.basename(srcFile)}`)
      })
    )
      .then(() => {
        done()
      })
      .catch((err) => {
        console.log(chalk.red('copy json files to dll error.\n'))
        throw err
      })
  }

  addDllVerToAsset() {
    const { assetsFile } = this.compute
    return fse.readJSON(assetsFile).then((content) => {
      const assetContent = { ...content, [winConst.dllVersion]: dllVer }
      fse.writeJSON(assetsFile, assetContent)
    })
  }

  applyManifestJson(done) {
    const jsonFiles = []

    const { getManifestPath, manifestFile } = this.compute

    const onLoadFiles = () => {
      if (jsonFiles.length < 3) {
        return
      }

      const entryJson = {}
      const dllContents = []
      jsonFiles.forEach((i) => {
        if (i.key === dllVendorFileName) {
          entryJson.name = _.get(i, 'content.name')
        }
        dllContents.push(_.get(i, 'content.content'))
      })

      entryJson.content = dllContents.reduce((sum, item) => _.assign({}, sum, item))
      dllFileKeys.forEach((fileKey) => {
        fse.removeSync(getManifestPath(fileKey))
      })

      fse
        .writeJSON(manifestFile, entryJson)
        .then(() => {
          return this.addDllVerToAsset()
        })
        .then(() => {
          this.copyJsonFilesToDllDir(done)
        })
        .catch((err) => {
          console.log(chalk.red('apply manifest json files error.\n'))
          throw err
        })
    }

    dllFileKeys.forEach((fileKey) => {
      fse.readJSON(getManifestPath(fileKey)).then((jsonContent) => {
        jsonFiles.push({
          key: fileKey,
          content: jsonContent,
        })
        onLoadFiles()
      })
    })
  }

  applyVendorEntry(done) {
    const { withHash } = this.options
    const { dllDir } = this.compute

    const { dllVendorFileName: vendorName, dllChunkFilePrefix: chunk } = constants

    glob(`${dllDir}/${withHash ? `${vendorName}_*` : vendorName}.js`, (err, files) => {
      if (err) {
        console.log(chalk.red('apply dll vendor file error.\n'))
        throw err
      }

      const vendor = files[0]
      if (!fse.existsSync(vendor)) {
        return
      }

      fse.readFile(vendor, 'utf8', function(readErr, content) {
        if (readErr) {
          console.log(`Unable to read: ${vendorName}`, readErr)
          return
        }

        // rewrite CSS,JS chunk files url
        const newContent = content
          .replace(
            new RegExp(
              `window\\.${withHash ? `${vendorName}_(\\w{6})` : vendorName}=function\\(e\\)\\{`,
              'm'
            ),
            `window.${
              withHash ? `${vendorName}_$1` : vendorName
            }=function(e){function getPath(){ var _path = ""; try {throw new Error()} catch (e) {var info = e.stack.match(/\\((?:https?|file):.*\\)/);if(info) { var temp = info[0]; _path = temp.slice(1, temp.lastIndexOf("/"));}} return _path + "/"; } window.${
              winConst.dllPath
            } = getPath(); window.${winConst.dllVersion}="${dllVer}";  if (window.${
              winConst.dllRequireVer
            } !== "${dllVer}") { console.error('current dll version is not match ovine lib require. Please replace the dll version to "'+ window.${
              winConst.dllRequireVer
            } +'".'); }`
          )
          .replace(/\+"\.css",(\w{1})=.{3}\+/m, `+".css",$1=window.${winConst.dllPath}+`)
          .replace(
            new RegExp(`function\\(e\\)\\{return .{3}\\+"${chunk}"`, 'm'),
            `function(e){ return window.${winConst.dllPath}+"${chunk}"`
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

  removeOldVerDllDir(done) {
    const dllPatten = `${this.options.siteDir}/${generatedDirName}/${staticDirName}/dll/*`
    glob(dllPatten, (err, matches) => {
      if (err) {
        console.log(chalk.red('remove old version dll dirs error.\n'))
        throw err
      }
      matches.forEach((item) => {
        if (path.basename(item) !== dllVer) {
          fse.removeSync(item)
        }
      })
      done()
    })
  }

  apply(compiler) {
    const taskCount = 2
    compiler.hooks.done.tapAsync({ name: 'DllPostPlugin' }, (__, done) => {
      const taskStatus = []
      const doneTask = () => {
        taskStatus.push(true)
        if (taskStatus.length === taskCount) {
          this.removeOldVerDllDir(done)
        }
      }

      this.applyManifestJson(doneTask)
      this.applyVendorEntry(doneTask)
    })
  }
}

module.exports = DllManifestPlugin
