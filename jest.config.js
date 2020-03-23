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
  testEnvironment: 'jsdom',
  testURL: 'http://localhost/',
  testPathIgnorePatterns: ignorePatterns,
  coveragePathIgnorePatterns: ignorePatterns,
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/packages/core/src/$1',
  },
}
