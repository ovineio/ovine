// babel 配置列表选项 https://babeljs.io/docs/en/options#sourcetype
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/plugin-syntax-dynamic-import'],
  env: {
    development: {
      plugins: ['react-hot-loader/babel'],
    },
  },
}
