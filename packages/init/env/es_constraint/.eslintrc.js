const OFF = 0
const WARNING = 1
const ERROR = 2

module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react-hooks', 'import'],
  env: {
    browser: true,
    commonjs: true,
    jest: true,
    jquery: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  rules: {
    curly: [WARNING, 'all'],
    semi: [ERROR, 'never'],
    quotes: [ERROR, 'single'],
    'no-template-curly-in-string': OFF,
    'class-methods-use-this': OFF, // It's a way of allowing private variables.
    'func-names': OFF,
    'no-unused-expressions': OFF,
    'no-nested-ternary': OFF,
    'global-require': OFF,
    'no-underscore-dangle': OFF,
    'no-param-reassign': OFF,
    'arrow-parens': [ERROR, 'always'],
    'no-use-before-define': ['error', { functions: false }],
    'no-console': ERROR,
    'react/jsx-closing-bracket-location': OFF, // Conflicts with Prettier.
    'react/jsx-filename-extension': [ERROR, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-one-expression-per-line': OFF,
    'react/no-array-index-key': OFF, // Sometimes its ok, e.g. non-changing data.
    'react/prop-types': OFF,
    'react/destructuring-assignment': OFF, // Too many lines.
    'react/prefer-stateless-function': WARNING,
    'react/jsx-props-no-spreading': OFF,
    'react-hooks/rules-of-hooks': ERROR,
    'import/no-dynamic-require': OFF,
    'import/extensions': OFF,
    'import/prefer-default-export': OFF,
    'import/no-unresolved': [ERROR, { ignore: ['^@/*', '^~/*'] }], // Ignore certain webpack alias because it can't be resolved
    'import/order': [
      // sort import groups
      ERROR,
      {
        groups: [['builtin', 'external'], 'internal', ['sibling', 'parent'], 'index'],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always-and-inside-groups',
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        pathGroups: [
          {
            pattern: '@[a-z]*/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'sibling',
            position: 'before',
          },
          {
            pattern: '~/**',
            group: 'sibling',
            position: 'before',
          },
        ],
      },
    ],
  },
}
