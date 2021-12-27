/* eslint-disable */

'use strict'
const path = require('path')
const loaderUtils = require('loader-utils')
const fs = require('fs')
const AddWorkerEntryPointPlugin_1 = require('monaco-editor-webpack-plugin/out/plugins/AddWorkerEntryPointPlugin')
const languages_1 = require('monaco-editor-webpack-plugin/out/languages')
const features_1 = require('monaco-editor-webpack-plugin/out/features')
var constants_1 = require('../../constants')
const INCLUDE_LOADER_PATH = require.resolve('monaco-editor-webpack-plugin/out/loaders/include')
const EDITOR_MODULE = {
  label: 'editorWorkerService',
  entry: undefined,
  worker: {
    id: 'vs/editor/editor',
    entry: 'vs/editor/editor.worker',
  },
}
const languagesById = {}
languages_1.languagesArr.forEach((language) => (languagesById[language.label] = language))
const featuresById = {}
features_1.featuresArr.forEach((feature) => (featuresById[feature.label] = feature))
/**
 * Return a resolved path for a given Monaco file.
 */
function resolveMonacoPath(filePath) {
  try {
    return require.resolve(path.join('monaco-editor/esm', filePath))
  } catch (err) {
    try {
      return require.resolve(path.join(process.cwd(), 'node_modules/monaco-editor/esm', filePath))
    } catch (err) {
      return require.resolve(filePath)
    }
  }
}
/**
 * Return the interpolated final filename for a worker, respecting the file name template.
 */
function getWorkerFilename(filename, entry) {
  return loaderUtils.interpolateName({ resourcePath: entry }, filename, {
    content: fs.readFileSync(resolveMonacoPath(entry)),
  })
}
function getFeaturesIds(userFeatures) {
  function notContainedIn(arr) {
    return (element) => arr.indexOf(element) === -1
  }
  let featuresIds
  if (userFeatures.length) {
    const excludedFeatures = userFeatures.filter((f) => f[0] === '!').map((f) => f.slice(1))
    if (excludedFeatures.length) {
      featuresIds = Object.keys(featuresById).filter(notContainedIn(excludedFeatures))
    } else {
      featuresIds = userFeatures
    }
  } else {
    featuresIds = Object.keys(featuresById)
  }
  return featuresIds
}
class MonacoEditorWebpackPlugin {
  constructor(options = {}) {
    const languages = options.languages || Object.keys(languagesById)
    const customLanguages = options.customLanguages || []
    const features = getFeaturesIds(options.features || [])
    this.options = {
      languages: coalesce(languages.map((id) => languagesById[id])).concat(customLanguages),
      features: coalesce(features.map((id) => featuresById[id])),
      filename: options.filename || '[name].worker.js',
      publicPath: options.publicPath || '',
      globalAPI: options.globalAPI || false,
    }
  }
  apply(compiler) {
    const { languages, features, filename, publicPath, globalAPI } = this.options
    // const compilationPublicPath = getCompilationPublicPath(compiler)
    const modules = [EDITOR_MODULE].concat(languages).concat(features)
    const workers = []
    modules.forEach((module) => {
      if (module.worker) {
        workers.push({
          label: module.label,
          id: module.worker.id,
          entry: module.worker.entry,
        })
      }
    })
    const rules = createLoaderRules(
      languages,
      features,
      workers,
      filename,
      publicPath,
      // compilationPublicPath,
      globalAPI
    )
    const plugins = createPlugins(compiler, workers, filename)
    addCompilerRules(compiler, rules)
    addCompilerPlugins(compiler, plugins)
  }
}
function addCompilerRules(compiler, rules) {
  const compilerOptions = compiler.options
  if (!compilerOptions.module) {
    compilerOptions.module = { rules: rules }
  } else {
    const moduleOptions = compilerOptions.module
    moduleOptions.rules = (moduleOptions.rules || []).concat(rules)
  }
}
function addCompilerPlugins(compiler, plugins) {
  plugins.forEach((plugin) => plugin.apply(compiler))
}
// function getCompilationPublicPath(compiler) {
//   if (compiler.options.output && compiler.options.output.publicPath) {
//     if (typeof compiler.options.output.publicPath === 'string') {
//       return compiler.options.output.publicPath
//     } else {
//       console.warn(`Cannot handle options.publicPath (expected a string)`)
//     }
//   }
//   return ''
// }
function createLoaderRules(
  languages,
  features,
  workers,
  filename,
  pluginPublicPath,
  // compilationPublicPath,
  globalAPI
) {
  if (!languages.length && !features.length) {
    return []
  }
  const languagePaths = flatArr(coalesce(languages.map((language) => language.entry)))
  const featurePaths = flatArr(coalesce(features.map((feature) => feature.entry)))
  const workerPaths = fromPairs(
    workers.map(({ label, entry }) => [label, getWorkerFilename(filename, entry)])
  )
  if (workerPaths['typescript']) {
    // javascript shares the same worker
    workerPaths['javascript'] = workerPaths['typescript']
  }
  if (workerPaths['css']) {
    // scss and less share the same worker
    workerPaths['less'] = workerPaths['css']
    workerPaths['scss'] = workerPaths['css']
  }
  if (workerPaths['html']) {
    // handlebars, razor and html share the same worker
    workerPaths['handlebars'] = workerPaths['html']
    workerPaths['razor'] = workerPaths['html']
  }
  // Determine the public path from which to load worker JS files. In order of precedence:
  // 1. Plugin-specific public path.
  // 2. Dynamic runtime public path.
  // 3. Compilation public path.
  // const pathPrefix = Boolean(pluginPublicPath)
  //   ? JSON.stringify(pluginPublicPath)
  //   : `typeof __webpack_public_path__ === 'string' ` +
  //     `? __webpack_public_path__ ` +
  //     `: ${JSON.stringify(compilationPublicPath)}`
  var pathPrefix =
    'window.' + constants_1.winConst.dllPath + ' || ' + JSON.stringify(pluginPublicPath)
  const globals = {
    MonacoEnvironment: `(function (paths) {
      function stripTrailingSlash(str) {
        return str.replace(/\\/$/, '');
      }
      return {
        globalAPI: ${globalAPI},
        getWorkerUrl: function (moduleId, label) {
          var pathPrefix = ${pathPrefix};
          var result = (pathPrefix ? stripTrailingSlash(pathPrefix) + '/' : '') + paths[label];
          if (/^((http:)|(https:)|(file:)|(\\/\\/))/.test(result)) {
            var currentUrl = String(window.location);
            var currentOrigin = currentUrl.substr(0, currentUrl.length - window.location.hash.length - window.location.search.length - window.location.pathname.length);
            if (result.substring(0, currentOrigin.length) !== currentOrigin) {
              if(/^(\\/\\/)/.test(result)) {
                result = window.location.protocol + result
              }
              var js = '/*' + label + '*/importScripts("' + result + '");';
              var blob = new Blob([js], { type: 'application/javascript' });
              return URL.createObjectURL(blob);
            }
          }
          return result;
        }
      };
    })(${JSON.stringify(workerPaths, null, 2)})`,
  }
  return [
    {
      test: /monaco-editor[/\\]esm[/\\]vs[/\\]editor[/\\]editor.(api|main).js/,
      use: [
        {
          loader: INCLUDE_LOADER_PATH,
          options: {
            globals,
            pre: featurePaths.map((importPath) => resolveMonacoPath(importPath)),
            post: languagePaths.map((importPath) => resolveMonacoPath(importPath)),
          },
        },
      ],
    },
  ]
}
function createPlugins(compiler, workers, filename) {
  var _a
  const webpack = (_a = compiler.webpack) !== null && _a !== void 0 ? _a : require('webpack')
  return [].concat(
    workers.map(
      ({ id, entry }) =>
        new AddWorkerEntryPointPlugin_1.AddWorkerEntryPointPlugin({
          id,
          entry: resolveMonacoPath(entry),
          filename: getWorkerFilename(filename, entry),
          plugins: [new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })],
        })
    )
  )
}
function flatArr(items) {
  return items.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return [].concat(acc).concat(item)
    }
    return [].concat(acc).concat([item])
  }, [])
}
function fromPairs(values) {
  return values.reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {})
}
function coalesce(array) {
  return array.filter(Boolean)
}
module.exports = MonacoEditorWebpackPlugin
