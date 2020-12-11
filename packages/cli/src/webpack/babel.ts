/**
 * babel-loader configuration
 */
import fs from 'fs-extra'
import { defaultsDeep, get } from 'lodash'
import path from 'path'

import { babelConfigFileName } from '../constants'

const { NODE_ENV = 'development' } = process.env

const styledDefConf = {
  development: {
    displayName: true,
  },
  production: {
    minify: true,
    pure: true,
    displayName: false,
  },
}

// function importPlugin(moduleName, dirName = '') {
//   return [
//     'babel-plugin-import',
//     {
//       libraryName: moduleName,
//       libraryDirectory: '',
//       camel2DashComponentName: false,
//     },
//     dirName,
//   ]
// }

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
type Options = {
  siteDir: string
  styledConfig?: any
}
export function getBabelConfig(option: Options) {
  const { siteDir, styledConfig = {} } = option
  const styledConf = defaultsDeep(styledConfig, styledDefConf)
  const styledFinalConf = get(styledConf, NODE_ENV) || styledConf.development

  return {
    ...extendsConfig(siteDir),
    compact: false,
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
      ['babel-plugin-styled-components', styledFinalConf],
      '@babel/plugin-syntax-dynamic-import',
      // importPlugin('lodash'),
    ],
  }
}

export function getDllBabelConfig(siteDir: string) {
  return {
    ...extendsConfig(siteDir),
    compact: false,
    plugins: ['@babel/plugin-syntax-dynamic-import'],
  }
}
