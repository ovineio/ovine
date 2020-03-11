import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

import shell from 'shelljs'

import { generatedDirName, stylesDirName, scssDirName } from '../constants'
import { getModulePath } from '../utils'

import chalk = require('chalk')

type Options = {
  verbose?: boolean
}
export async function theme(siteDir: string, options: Options = {}): Promise<void> {
  const { verbose = false } = options

  const nodeScssCmd = getNodeScssCmd()
  const scssCmdOpts = { async: true, silent: !verbose }
  if (!nodeScssCmd) {
    console.log(
      chalk.yellowBright('You need install `node-sass` module as devDependencies or globally...')
    )
    return
  }

  console.log(chalk.blue('Build scss to css files...'))

  const amisScss = getModulePath(siteDir, 'amis/scss/themes', true)
  const libScss = getModulePath(siteDir, `lib/core/${scssDirName}`, true)
  const destStyles = `${siteDir}/${generatedDirName}/${stylesDirName}`
  const siteScss = `${siteDir}/${scssDirName}`
  const hasSiteScss = fs.existsSync(siteScss)

  const relativeDir = path.relative(process.cwd(), destStyles)

  const importer = `--importer ${path.resolve(__dirname, '../scss_importer.js')}`

  const includePaths = (pathAr) => pathAr.map((i) => ` --include-path ${i}`).join(' ')

  const resultFlag: string[] = []
  const logSuccess = (type: 'lib' | 'site') => {
    resultFlag.push(type)
    if (resultFlag.length === 2) {
      console.log(
        `\n${chalk.green('Success!')} Generated css files in ${chalk.cyan(relativeDir)}.\n`
      )
    }
  }

  // build libScss
  const libCmd = `${nodeScssCmd} ${libScss} -o ${destStyles} ${importer} ${includePaths(
    !hasSiteScss ? [amisScss] : [amisScss, siteScss]
  )}`
  // console.log('libCmd===>\n', libCmd, '\n')
  shell.exec(libCmd, scssCmdOpts, (_, __, stderr) => {
    if (stderr) {
      console.error(chalk.red(stderr))
      return
    }
    logSuccess('lib')
  })

  // build siteScss
  if (hasSiteScss) {
    const siteCmd = `${nodeScssCmd} ${siteScss} -o ${destStyles} ${importer} ${includePaths([
      amisScss,
      libScss,
    ])}`
    // console.log('siteCmd===>\n', siteCmd, '\n')
    shell.exec(siteCmd, scssCmdOpts, (_, __, stderr) => {
      if (stderr) {
        console.error(chalk.red(stderr))
        return
      }
      logSuccess('site')
    })
  }
}

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
