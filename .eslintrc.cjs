// const { defineConfig } = require('eslint-define-config');

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: ['prettier', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  // ignorePatterns: ['fr/.vitepress/cache'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: ['./*.cjs'],
      env: {
        node: true
      }
    }
  ]
};
