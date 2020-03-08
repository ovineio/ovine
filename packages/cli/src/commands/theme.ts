import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'

import shell from 'shelljs'

import { dllDirPath, generatedDirName, stylesDirName, scssDirName } from '../constants'
import { getModulePath } from '../utils'

import chalk = require('chalk')

export async function theme(siteDir: string): Promise<void> {
  process.env.BABEL_ENV = 'production'
  process.env.NODE_ENV = 'production'

  // const { siteDir } = loadContext(siteDir)
  // 'node-sass ./src/assets/styles/scss/themes -o ./src/assets/styles/themes --include-path node_modules/amis/scss/themes'

  const nodeScssCmd = getNodeScssCmd()
  if (!nodeScssCmd) {
    console.log(
      chalk.yellowBright('You need install `node-sass` module as devDependencies or globally...')
    )
    return
  }

  console.log(chalk.blue('Build scss to css files...'))

  const amisScss = getModulePath(siteDir, 'amis/scss/themes', true)
  const libScss = getModulePath(siteDir, `lib/${scssDirName}`, true)
  const destStyles = `${siteDir}/${generatedDirName}/${stylesDirName}`

  const siteScss = `${siteDir}/${scssDirName}`

  const includePathAr = [amisScss]

  if (fs.existsSync(siteScss)) {
    includePathAr.push(siteScss)
  }

  const cmd = `${nodeScssCmd} ${libScss} -o ${destStyles} --include-path ${includePathAr}`
  shell.exec(cmd, (_, stdout, stderr) => {
    if (stderr) {
      console.warn(chalk.red(stderr))
      return
    }
    console.log(stdout)
  })

  const relativeDir = path.relative(process.cwd(), dllDirPath)
  console.log(`\n${chalk.green('Success!')} Generated css files in ${chalk.cyan(relativeDir)}.\n`)
}

function getNodeScssCmd(): string {
  try {
    execSync('node-sass --version', { stdio: 'ignore' })
    return 'node-sass'
  } catch (_) {
    //
  }

  try {
    execSync('./node_modules/.bin/node-sass --version', { stdio: 'ignore' })
    return './node_modules/.bin/node-sass'
  } catch (_) {
    //
  }

  return ''
}
