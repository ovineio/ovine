/**
 * load & check site config
 */

import fs from 'fs-extra'
import importFresh from 'import-fresh'
import _ from 'lodash'
import path from 'path'

import { outDirName, configFileName, generatedDirName, srcDirName } from './constants'
import { LoadContext, SiteConfig } from './types'

const requiredFields = ['favicon', 'title']

const optionalFields = [
  'publicPath',
  'envModes',
  'splitCodeRoutes',
  'template',
  'initTheme',
  'staticFileExts',
  'devServerProxy',
]

const defaultConfig = {
  publicPath: '/',
  template: {},
  devServerProxy: {},
}

function formatFields(fields: string[]): string {
  return fields.map((field) => `'${field}'`).join(', ')
}

export function loadConfig(siteDir: string): SiteConfig {
  const configPath = path.resolve(siteDir, configFileName)

  if (!fs.existsSync(configPath)) {
    throw new Error(`${configFileName} not found`)
  }

  const loadedConfig = importFresh(configPath) as Partial<SiteConfig>
  const missingFields = requiredFields.filter((field) => !_.has(loadedConfig, field))

  if (missingFields.length > 0) {
    throw new Error(
      `The required field(s) ${formatFields(missingFields)} are missing from ${configFileName}`
    )
  }

  // Merge default config with loaded config.
  const config = {
    ...defaultConfig,
    ...loadedConfig,
  }

  // Don't allow unrecognized fields.
  const allowedFields = [...requiredFields, ...optionalFields]
  const unrecognizedFields = Object.keys(config).filter((field) => !allowedFields.includes(field))

  const { publicPath, envModes } = config
  // TODO: use json schema for Configuration verification!
  if (unrecognizedFields.length) {
    throw new Error(
      `The field(s) ${formatFields(unrecognizedFields)} are not recognized in ${configFileName}`
    )
  }

  if (typeof publicPath !== 'string' || publicPath.substr(-1) !== '/') {
    throw new Error(
      `publicPath: "${publicPath}" is not allowed. The "publicPath" must be string end with "/". eg: "/subPath/"`
    )
  }

  if (envModes) {
    if (!_.isArray(envModes) || envModes.some((i) => typeof i !== 'string')) {
      throw new Error(
        `envModes: "${envModes}" is not allowed. The "envModes" must be array of string.`
      )
    }
  }

  return config as SiteConfig
}

export function loadContext(siteDir: string): LoadContext {
  const genDir: string = path.resolve(siteDir, generatedDirName)
  const siteConfig: SiteConfig = loadConfig(siteDir)
  const outDir = path.resolve(siteDir, outDirName)
  const srcDir = path.resolve(siteDir, srcDirName)
  const { publicPath } = siteConfig

  return {
    siteDir,
    genDir,
    siteConfig,
    outDir,
    srcDir,
    publicPath,
  }
}
