const path = require('path')

const ignorePatterns = [
  '/node_modules/',
  '__fixtures__',
  '/packages/cli/lib',
  '/packages/core/lib',
  '/packages/init/lib',
  '/packages/craft/lib',
]

module.exports = {
  rootDir: path.resolve(__dirname),
  verbose: true,
  preset: 'ts-jest',
  testURL: 'http://localhost/',
  testEnvironment: 'node',
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
}
