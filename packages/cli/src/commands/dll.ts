import path from 'path'

import { loadContext } from '../config'
import { dllDirPath } from '../constants'
import { BuildCliOptions, Props } from '../types'
import { compileWebpack, globalStore } from '../utils'
import { createDllConfig, monacoWorkerConfig } from '../webpack/dll'

import chalk = require('chalk')

export async function dll(
  siteDir: string,
  cliOptions: Partial<BuildCliOptions> = {}
): Promise<void> {
  process.env.BABEL_ENV = 'production'
  process.env.NODE_ENV = 'production'
  globalStore('set', 'isProd', true)

  console.log(chalk.blue('\nCreating an webpack dll static files build...'))

  const props: Props = loadContext(siteDir)
  const confOptions = { ...props, ...cliOptions }

  const dllConfig = createDllConfig(confOptions)
  const monacoConfig = monacoWorkerConfig(confOptions)

  const confArr = [dllConfig, monacoConfig].filter(Boolean)

  if (!confArr.length) {
    return
  }

  await compileWebpack(confArr)

  console.log(
    `\n${chalk.green('Success!')} Generated dll files in ${chalk.cyan(
      path.relative(siteDir, dllDirPath)
    )}.\n`
  )
}
