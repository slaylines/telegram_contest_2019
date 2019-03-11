module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  env: {
    es6: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-console': 1,
  },
};
