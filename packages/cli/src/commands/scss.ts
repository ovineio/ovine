import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

import shell from 'shelljs'

import { generatedDirName, stylesDirName, scssDirName } from '../constants'
import { getModulePath } from '../utils'

import chalk = require('chalk')

type Options = {
  verbose?: boolean
  watch?: boolean
}
export async function scss(siteDir: string, options: Options = {}): Promise<void> {
  const { verbose = false, watch = false } = options

  const nodeScssCmd = getNodeScssCmd()
  const scssCmdOpts = { async: true, silent: watch ? false : !verbose }
  if (!nodeScssCmd) {
    console.log(
      chalk.yellowBright('You need install `node-sass` module as devDependencies or globally...')
    )
    return
  }

  if (watch) {
    console.log(chalk.blue('watch scss files changes...'))
  } else {
    console.log(chalk.blue('Build scss to css files...'))
  }

  const amisScss = getModulePath(siteDir, 'amis/scss/themes', true)
  const libScss = getModulePath(siteDir, `lib/core/${scssDirName}`, true)
  const destStyles = `${siteDir}/${generatedDirName}/${stylesDirName}`
  const siteScss = `${siteDir}/${scssDirName}`
  const hasSiteScss = fs.existsSync(siteScss)

  const relativeDir = path.relative(process.cwd(), destStyles)

  const importer = `--importer ${path.resolve(__dirname, '../scss_importer.js')}`
  const useWatch = !watch ? '' : '--watch --recursive'

  const includePaths = (pathAr) => pathAr.map((i) => ` --include-path ${i}`).join(' ')

  const resultFlag: string[] = []
  const logSuccess = (type: 'lib' | 'site') => {
    const logStr = `\n${chalk.green('Success!')} Generated css files in ${chalk.cyan(
      relativeDir
    )}.\n`

    if (!hasSiteScss) {
      console.log(logStr)
      return
    }

    resultFlag.push(type)
    if (resultFlag.length === 2) {
      console.log(logStr)
    }
  }

  // build libScss
  const libCmd = `${nodeScssCmd} ${libScss} ${useWatch} -o ${destStyles} ${importer} ${includePaths(
    !hasSiteScss ? [amisScss] : [amisScss, siteScss]
  )}`
  // console.log('libCmd===>\n', libCmd, '\n')
  shell.exec(libCmd, scssCmdOpts, (_, stdout, stderr) => {
    if (stderr && !/No input file/.test(stderr)) {
      console.error(chalk.red(stderr))
      return
    }
    copyFiles(libScss, destStyles)
    if (watch) {
      console.log(stdout)
    } else {
      logSuccess('lib')
    }
  })

  // build siteScss
  if (hasSiteScss) {
    const siteCmd = `${nodeScssCmd} ${siteScss} ${useWatch} -o ${destStyles} ${importer}  ${includePaths(
      [amisScss, libScss]
    )}`
    // console.log('siteCmd===>\n', siteCmd, '\n')s
    shell.exec(siteCmd, scssCmdOpts, (_, stdout, stderr) => {
      if (stderr && !/No input file/.test(stderr)) {
        console.error(chalk.red(stderr))
        return
      }

      copyFiles(siteScss, destStyles)
      if (watch) {
        console.log(stdout)
      } else {
        logSuccess('site')
      }
    })
  }
}

// check node-sass cli commander
function getNodeScssCmd(): string {
  let cmd = 'node-sass'
  try {
    execSync('node-sass -v', { stdio: 'ignore' })
    return cmd
  } catch (_) {
    //
  }

  cmd = './node_modules/.bin/node-sass'
  try {
    execSync(`${cmd} -v`, { stdio: 'ignore' })
    return cmd
  } catch (_) {
    //
  }

  return ''
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
