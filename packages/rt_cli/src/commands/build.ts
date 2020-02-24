import chalk = require('chalk')
import fs from 'fs-extra'
import path from 'path'
import webpack, { Configuration, Plugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import merge from 'webpack-merge'

import { loadConfig } from '../config'
import { BuildCLIOptions, Props } from '../types'
import { createClientConfig } from '../webpack/client'
import { applyConfigureWebpack } from '../webpack/utils'

export async function build(
  siteDir: string,
  cliOptions: Partial<BuildCLIOptions> = {}
): Promise<void> {
  process.env.BABEL_ENV = 'production'
  process.env.NODE_ENV = 'production'
  console.log(chalk.blue('Creating an optimized production build...'))

  const props: Props = loadConfig(siteDir)

  // Apply user webpack config.
  const { outDir, generatedFilesDir, plugins } = props

  const clientManifestPath = path.join(generatedFilesDir, 'client-manifest.json')
  let clientConfig: Configuration = merge(createClientConfig(props), {
    plugins: [
      // Visualize size of webpack output files with an interactive zoomable treemap.
      cliOptions.bundleAnalyzer && new BundleAnalyzerPlugin(),
      // Generate client manifests file that will be used for server bundle.
    ].filter(Boolean) as Plugin[],
  })

  // Plugin Lifecycle - configureWebpack.
  plugins.forEach((plugin) => {
    const { configureWebpack } = plugin
    if (!configureWebpack) {
      return
    }

    clientConfig = applyConfigureWebpack(
      configureWebpack.bind(plugin), // The plugin lifecycle may reference `this`.
      clientConfig,
      false
    )
  })

  // Make sure generated client-manifest is cleaned first so we don't reuse
  // the one from previous builds.
  if (fs.existsSync(clientManifestPath)) {
    fs.unlinkSync(clientManifestPath)
  }

  // Plugin Lifecycle - postBuild.
  await Promise.all(
    plugins.map(async (plugin) => {
      if (!plugin.postBuild) {
        return
      }
      await plugin.postBuild(props)
    })
  )

  const relativeDir = path.relative(process.cwd(), outDir)
  console.log(
    `\n${chalk.green('Success!')} Generated static files in ${chalk.cyan(relativeDir)}.\n`
  )
}
