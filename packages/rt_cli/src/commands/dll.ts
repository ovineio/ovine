import chalk = require('chalk')
import path from 'path'
import { Configuration } from 'webpack'

import { loadContext } from '../config'
import { dllDirName } from '../constants'
import { BuildCliOptions, Props } from '../types'
import { compileWebpack, mergeWebpackConfig } from '../utils'
import { createDllConfig } from '../webpack/dll'

export async function dll(
  siteDir: string,
  cliOptions: Partial<BuildCliOptions> = {}
): Promise<void> {
  process.env.BABEL_ENV = 'production'
  process.env.NODE_ENV = 'production'
  console.log(chalk.blue('Creating an webpack dll build static files...'))

  const props: Props = loadContext(siteDir)

  const dllConfig: Configuration = createDllConfig({ ...props, ...cliOptions })

  const realDllConfig = mergeWebpackConfig(dllConfig, `${siteDir}/webpack.dll.js`)

  await compileWebpack(realDllConfig)

  const relativeDir = path.relative(process.cwd(), dllDirName)
  console.log(`\n${chalk.green('Success!')} Generated dll files in ${chalk.cyan(relativeDir)}.\n`)
}
