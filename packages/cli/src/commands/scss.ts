/**
 * for build css files from amis src scss dir.
 * TODO: 暂时先移除 编译 项目文件夹下的scss文件功能，后期稳定了之后，考虑补回来。
 */

// import { execSync } from 'child_process'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import sass  from 'sass'

import { generatedDirName, stylesDirName, scssDirName } from '../constants'

import { getModulePath } from '../utils'
 
// eslint-disable-next-line import/order
import chalk = require('chalk')

type Options = {
  verbose?: boolean
  watch?: boolean
}
export async function scss(siteDir: string, options: Options = {}): Promise<void> {
  const {  watch = false } = options // verbose = false,

  if (watch) {
    console.log(chalk.blue('watch scss files changes...'))
  } else {
    console.log(chalk.blue('Build scss to css files...'))
  }

  const amisScss = getModulePath(siteDir, 'amis/scss/themes', true)
  const libScss = getModulePath(siteDir, `lib/core/${scssDirName}`, true)
  const destStyles = `${siteDir}/${generatedDirName}/${stylesDirName}`
  const relativeDir = path.relative(process.cwd(), destStyles)

  const themesDir = 'themes'
  try {
    glob(`${libScss}/${themesDir}/!(_)*.scss`, (err: any, files: string[]) => {
      if (err) {
        console.error(err)
      } else {
        files.forEach((file) => {
          const outFile = `${destStyles}/${themesDir}/${path.basename(file, '.scss')}.css`
          const res = sass.renderSync({
            file,
            outFile,
            includePaths: [amisScss],
          })
          fs.ensureDirSync(path.dirname(outFile))
          fs.writeFileSync(outFile, res.css.toString())
          console.log(chalk.grey(`Generated ${outFile}`))
        })
        copyFiles(libScss, destStyles)
        const logStr = `\n${chalk.green('Success!')} Generated css files in ${chalk.cyan(
          relativeDir
        )}.\n`
        console.log(logStr)
      }
    })
  }catch(err) {
    console.error(err)
  }
}

function copyFiles(src, dest) {
  try {
    fs.copySync(src, dest, {
      filter(filePath) {
        const isLibDir = filePath.indexOf('core/scss/_lib') > -1
        return !isLibDir && !/\.scss$/.test(filePath)
      },
    })
  } catch (e) {
    console.log(chalk.red(e))
    throw new Error(chalk.red('Copy files occurred error!'))
  }
}
