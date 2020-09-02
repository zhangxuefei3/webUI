module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 'off',
    'no-unused-vars': 'warn',
    'quote-props': 'off'
  }
}
