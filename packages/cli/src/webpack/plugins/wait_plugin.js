// const fs = require('fs-extra')
// const path = require('path')
// const { waitFile } = require('wait-file')

// class WaitPlugin {
//   constructor(options) {
//     this.filepath = options.filepath
//   }

//   apply(compiler) {
//     // Before finishing the compilation step
//     compiler.hooks.make.tapAsync('WaitPlugin', (compilation, callback) => {
//       // To prevent 'waitFile' error on waiting non-existing directory
//       fs.ensureDir(path.dirname(this.filepath), () => {
//         // Wait until file exist
//         waitFile({
//           resources: [this.filepath],
//           interval: 300,
//         })
//           .then(() => {
//             callback()
//           })
//           .catch((error) => {
//             console.warn(`WaitPlugin error: ${error}`)
//           })
//       })
//     })
//   }
// }

// module.exports = WaitPlugin
