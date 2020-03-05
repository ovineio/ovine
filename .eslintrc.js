const OFF = 0
const WARNING = 1
const ERROR = 2

module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react-hooks', 'import', "@typescript-eslint"],
  env: {
    browser: true,
    commonjs: true,
    jest: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  rules: {
    curly: [WARNING, 'all'],
    semi: [ERROR, 'never'],
    quotes: [ERROR, 'single'],
    'arrow-parens': [ERROR, 'always'],
    "no-use-before-define": ["error", { "functions": false }],
    'class-methods-use-this': OFF, // It's a way of allowing private variables.
    'func-names': OFF,
    'no-unused-expressions': OFF,
    'no-nested-ternary': OFF,
    'no-console': ERROR,
    'no-underscore-dangle': OFF,
    '@typescript-eslint/no-unused-expressions': ERROR,
    "import/no-dynamic-require": OFF,
    'import/no-unresolved': [ERROR], // Ignore certain webpack alias because it can't be resolved
    'import/extensions': OFF,
    'import/prefer-default-export': OFF,
    'import/order': [ // sort import groups
      ERROR,
      {
        groups: [['builtin', 'external'], 'internal', ['sibling', 'parent'], 'index'],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
          },
        ],
        'newlines-between': 'always-and-inside-groups',
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
      },
    ],
    'jsx-a11y/click-events-have-key-events': WARNING,
    'jsx-a11y/no-noninteractive-element-interactions': WARNING,
    'react/jsx-closing-bracket-location': OFF, // Conflicts with Prettier.
    'react/jsx-filename-extension': OFF,
    'react/jsx-one-expression-per-line': OFF,
    'react/no-array-index-key': OFF, // Sometimes its ok, e.g. non-changing data.
    'react/prop-types': OFF,
    'react/destructuring-assignment': OFF, // Too many lines.
    'react/prefer-stateless-function': WARNING,
    'react/jsx-props-no-spreading': OFF,
    'react-hooks/rules-of-hooks': ERROR,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [ERROR, { args: 'none' }]
      }
    }
  ]
}
