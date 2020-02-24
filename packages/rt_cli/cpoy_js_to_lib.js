const path = require('path');
const fs = require('fs-extra');

const srcDir = path.resolve(__dirname, 'src');
const libDir = path.resolve(__dirname, 'lib');
fs.copySync(srcDir, libDir, {
  filter(filePath) {
    return !/__tests__/.test(filePath) && !/\.ts$/.test(filePath);
  },
});
