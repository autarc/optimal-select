module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
  },
  'extends': 'eslint:recommended',
  'globals': {
    'global': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-unused-expressions': 'warn',
    'no-unused-vars': 'warn',
  },
  'overrides': [
    {
      'files': ['tests/**'],
      'env': {
        'mocha': true
      }
    },
    {
      'files': ['example/**'],
      'env': {
        'browser': true
      },
      'rules': {
        'indent': 'off',
        'no-redeclare': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'quotes': 'off',
        'semi': 'off',
      }
    }
  ]
}
