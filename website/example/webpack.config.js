const path = require('path')

module.exports = {
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@rtadmin/core': path.resolve(__dirname, '../../../../core'),
    },
  },
}
