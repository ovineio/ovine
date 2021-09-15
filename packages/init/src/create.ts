import chalk from 'chalk'
import fs from 'fs'
import fse from 'fs-extra'

import { updatePkg, copyDirSync, logOra } from './utils'

type CrateOvAppOpts = {
  template: string
  name: string
  useTs: boolean
  useLint: boolean
  dest: string
  libDir: string
  version?: string
  showLog?: boolean
}
export async function createOvApp(options: CrateOvAppOpts) {
  const { name, template, useTs, dest, libDir, useLint, version, showLog = false } = options

  try {
    // copy basic files
    copyDirSync({
      dest,
      showLog,
      src: `${libDir}/templates/${template}`,
      handle: (currItem: string) => {
        const reg = useTs ? /\.tsx?$/ : /\.jsx?$/
        const isDir = currItem.indexOf('.') === -1
        const esReg = /\.[j|t]sx?$/
        return isDir || reg.test(currItem) || !esReg.test(currItem)
      },
    })

    fs.readdirSync(`${libDir}/env`)
      .sort((a, b) => a.localeCompare(b))
      .forEach((i) => {
        if (
          // ts not copy es_**/ files
          (useTs && /^es_/.test(i)) ||
          // es not copy ts_**/ files
          (!useTs && /^ts_/.test(i)) ||
          // without eslint not copy *_constraint/** files
          (!useLint && /_constraint$/.test(i))
        ) {
          return
        }

        const srcPath = `${libDir}/env/${i}`
        const srcStat = fs.statSync(srcPath)
        if (/(_constraint|_normal)$/.test(i)) {
          copyDirSync({
            showLog,
            dest,
            src: srcPath,
            handle: (currItem: string) => {
              // fixed: ".gitignore" is omit by npm registry
              return currItem === 'gitignore' ? '.gitignore' : true
            },
          })
        } else if (srcStat.isDirectory()) {
          copyDirSync({ showLog, src: srcPath, dest: `${dest}/${i}` })
        } else if (srcStat.isFile()) {
          fse.copySync(srcPath, `${dest}/${i}`, {
            overwrite: true,
          })
        }
      })
  } catch (err) {
    logOra('fail', chalk.red('Copying template files failed!'))
    throw err
  }

  // Update package.json info.
  try {
    const updater: any = {
      name,
      version: '0.0.1',
      private: true,
    }

    if (version) {
      updater.dependencies = {
        '@ovine/core': version,
        '@ovine/cli': version,
      }
    }
    await updatePkg(`${dest}/package.json`, updater)
  } catch (err) {
    logOra('fail', chalk.red('Failed to update package.json'))
    throw err
  }
}
