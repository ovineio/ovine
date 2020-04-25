/**
 * load & check site config
 */

import fs from 'fs-extra'
import importFresh from 'import-fresh'
import _ from 'lodash'
import path from 'path'

import { outDirName, configFileName, generatedDirName, srcDirName } from './constants'
import { LoadContext, SiteConfig } from './types'

const requiredFields = ['publicPath', 'favicon', 'title']

const optionalFields = [
  'envModes',
  'isSplitCode',
  'splitCodeRoutes',
  'template',
  'staticFileExt',
  'devServerProxy',
]

const defaultConfig = {
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

  if (unrecognizedFields.length) {
    throw new Error(
      `The field(s) ${formatFields(unrecognizedFields)} are not recognized in ${configFileName}`
    )
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
