/**
 * babel-loader configuration
 */
import fs from 'fs-extra'
import path from 'path'

import { babelConfigFileName } from '../constants'

const { NODE_ENV = 'development' } = process.env

const styledComponents = {
  development: {
    displayName: true,
  },
  production: {
    minify: true,
    pure: true,
    displayName: false,
  },
}

const styledConfig = {
  styledComponents: styledComponents[NODE_ENV] || styledComponents.development,
}

function importPlugin(moduleName, dirName = '') {
  return [
    'babel-plugin-import',
    {
      libraryName: moduleName,
      libraryDirectory: '',
      camel2DashComponentName: false,
    },
    dirName,
  ]
}

function extendsConfig(siteDir: string) {
  const configFile = path.resolve(siteDir, babelConfigFileName)
  if (!fs.existsSync(configFile)) {
    return {}
  }

  return {
    extends: configFile,
  }
}

// babel config https://babeljs.io/docs/en/options#sourcetype
export function getBabelConfig(siteDir: string) {
  return {
    ...extendsConfig(siteDir),
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            esmodules: true,
          },
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      'react-hot-loader/babel',
      'babel-plugin-macros',
      ['babel-plugin-styled-components', styledConfig],
      '@babel/plugin-syntax-dynamic-import',
      importPlugin('lodash'),
    ],
  }
}

export function getDllBabelConfig(siteDir: string) {
  return {
    ...extendsConfig(siteDir),
    compact: true,
    plugins: ['@babel/plugin-syntax-dynamic-import'],
  }
}
