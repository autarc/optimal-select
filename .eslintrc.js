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
    ]
  }
}
