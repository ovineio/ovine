const path = require('path')

const ignorePatterns = [
  'node_modules',
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
  setupFiles: ['<rootDir>/testing/jest_setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/packages/core/src/$1', // TODO: "@/" prefix change
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/testing/file_mock.js',
    '\\.(css|scss)$': '<rootDir>/testing/style_mock.js',
  },
  testMatch: ['**/__tests__/**/*.test.[j|t]s?(x)'],
}
