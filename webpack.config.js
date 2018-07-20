// const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

// 对roadhog默认配置进行操作
module.exports = config => {
  config.plugins.push(new MonacoWebpackPlugin({
    output: 'code_editor',
    languages: ['json', 'yaml'],
    features: ['format', 'hover', 'smartSelect'],
  }));

  config.module.rules.unshift({
    test: /\.yaml$/,
    use: ['json-loader', 'yaml-loader'],
  });

  config.module.rules.forEach(r => {
    if (Array.isArray(r.exclude)) {
      r.exclude.push(/\.yaml$/);
    }
  });

  return config;
};
