/**
 * load & check site config
 */

import fs from 'fs-extra'
import importFresh from 'import-fresh'
import _ from 'lodash'
import path from 'path'

import { outDirName, configFileName, generatedDirName, srcDirName } from './constants'
import { BuildCliOptions, LoadContext, SiteConfig } from './types'

const requiredFields = ['favicon', 'title']

const optionalFields = [
  'appKey',
  'publicPath',
  'dll',
  'envModes',
  'devServer',
  'ui',
  'staticFileExts',
  'template',
  'styledConfig',
  'cacheGroups',
  'splitRoutes',
]

const defaultConfig = {
  appKey: '',
  publicPath: '/',
  template: {},
  devServer: {},
  dll: {},
  ui: {
    defaultTheme: 'cxd',
    withoutPace: false,
  },
}

function formatFields(fields: string[]): string {
  return fields.map((field) => `'${field}'`).join(', ')
}

function checkPath(pathStr: string, value: string = '', egText?: string) {
  if (value && !(typeof value === 'string' && value.substr(-1) === '/')) {
    throw new Error(
      `${pathStr}: "${value}" is not allowed. The "${pathStr}" must be string end with "/". eg: "${egText ||
        'https://abc.com/'}"`
    )
  }
}

export function loadConfig(siteDir: string, options: Partial<BuildCliOptions>): SiteConfig {
  const configPath = path.resolve(siteDir, configFileName)

  if (!fs.existsSync(configPath)) {
    throw new Error(`${configPath} not found! Please check the command line args.`)
  }

  const configFile = importFresh(configPath) as Partial<SiteConfig>

  const loadedConfig = _.isPlainObject(configFile)
    ? configFile
    : _.isFunction(configFile)
    ? configFile(options)
    : {}

  const missingFields = requiredFields.filter((field) => !_.has(loadedConfig, field))

  if (missingFields.length > 0) {
    throw new Error(
      `The required field(s) ${formatFields(missingFields)} are missing from ${configFileName}`
    )
  }

  // Merge default config with loaded config.
  const config = _.defaultsDeep(
    loadedConfig,
    {
      // defaultDevConfig
      devServer: loadedConfig.publicPath?.startsWith('/')
        ? {
            publicPath: loadedConfig.publicPath,
            openPage: loadedConfig.publicPath,
          }
        : {},
    },
    defaultConfig
  )

  // Don't allow unrecognized fields.
  const allowedFields = [...requiredFields, ...optionalFields]
  const unrecognizedFields = Object.keys(config).filter((field) => !allowedFields.includes(field))

  const { publicPath = '/', dll, envModes } = config

  checkPath('publicPath', publicPath)
  checkPath('dll.publicPath', dll.publicPath)
  checkPath('dll.hostDir', dll.hostDir)

  // TODO: use json schema for Configuration verification!
  if (unrecognizedFields.length) {
    throw new Error(
      `The field(s) ${formatFields(unrecognizedFields)} are not recognized in ${configFileName}`
    )
  }

  if (envModes) {
    if (!_.isArray(envModes) || envModes.some((i) => typeof i !== 'string')) {
      throw new Error(
        `envModes: "${envModes}" is not allowed. The "envModes" must be array of string. eg: ["local", "test", "prod"]`
      )
    }
  }

  return config as SiteConfig
}

export function loadContext(siteDir: string, options: Partial<BuildCliOptions>): LoadContext {
  const genDir: string = path.resolve(siteDir, generatedDirName)

  const siteConfig: SiteConfig = loadConfig(siteDir, options)

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
