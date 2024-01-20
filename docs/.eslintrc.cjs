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
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      files: ['./*.cjs'],
      env: {
        node: true
      }
    },
    {
      files: ['src/**/*', '.vitepress/*.ts', '.vitepress/*.js', '.vitepress/theme/**/*']
    }
  ]
};
