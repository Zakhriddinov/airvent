module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script', // sourceType ni 'script' ga o'zgartiring
  },
  rules: {
    'no-console': 0,
  },
};
