const OFF = 'off'
const WARNING = 'warn'
const ERROR = 'error'

module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['react-hooks', 'import', '@typescript-eslint'],
  env: {
    browser: true,
    commonjs: true,
    jest: true,
    node: true,
    jquery: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    allowImportExportEverywhere: true,
  },
  rules: {
    curly: [WARNING, 'all'],
    semi: [ERROR, 'never'],
    quotes: [ERROR, 'single'],
    'class-methods-use-this': OFF, // It's a way of allowing private variables.
    'func-names': OFF,
    'no-unused-expressions': OFF,
    'no-nested-ternary': OFF,
    'global-require': OFF,
    'no-underscore-dangle': OFF,
    'no-template-curly-in-string': OFF,
    'no-param-reassign': OFF,
    'arrow-parens': [ERROR, 'always'],
    'no-use-before-define': OFF,
    'no-console': ERROR,
    'no-unused-vars': OFF,
    '@typescript-eslint/no-unused-vars': [ERROR, { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': [
      ERROR,
      {
        functions: false,
        enums: false,
        variables: false,
        typedefs: false,
      },
    ],
    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/no-noninteractive-element-interactions': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,
    'react/require-default-props': OFF,
    'react/jsx-closing-bracket-location': OFF, // Conflicts with Prettier.
    'react/jsx-filename-extension': [ERROR, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-no-target-blank': OFF,
    'react/jsx-one-expression-per-line': OFF,
    'react/no-array-index-key': OFF, // Sometimes its ok, e.g. non-changing data.
    'react/prop-types': OFF,
    'react/destructuring-assignment': OFF, // Too many lines.
    'react/prefer-stateless-function': WARNING,
    'react/jsx-props-no-spreading': OFF,
    'import/no-dynamic-require': OFF,
    'import/extensions': OFF,
    'import/prefer-default-export': OFF,
    'react-hooks/rules-of-hooks': ERROR,
    'import/no-unresolved': [ERROR, { ignore: ['^@/*', '^~/*', '_', '__'] }], // Ignore certain webpack alias because it can't be resolved
    'import/no-extraneous-dependencies': OFF,
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
  overrides: [
    {
      files: ['*.d.ts'],
      rules: {
        'spaced-comment': OFF,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': OFF,
        'no-redeclare': OFF,
        'import/no-unresolved': OFF,
        'import/no-extraneous-dependencies': OFF,
      },
    },
  ],
}
