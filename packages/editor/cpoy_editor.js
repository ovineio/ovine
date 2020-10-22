const fs = require('fs-extra')
const path = require('path')

const srcDir = path.resolve(__dirname, 'src/assets')
const libDir = path.resolve(__dirname, 'lib/assets')

fs.removeSync(libDir)
fs.copySync(srcDir, libDir, {
  filter(filePath) {
    return !/__tests__/.test(filePath) && !/\.ts$/.test(filePath)
  },
})
