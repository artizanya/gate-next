// Hey Emacs, this is -*- coding: utf-8 -*-
/* global module */

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    // 'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified
    // from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'max-len': ['warn', 80],
    'operator-linebreak': ['error', 'after'],
    'brace-style': ['warn', 'stroustrup', { allowSingleLine: true }],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'lines-between-class-members': [
      'error', 'always', { exceptAfterSingleLine: true },
    ],
    'keyword-spacing': ['error', {
      overrides: {
        if: { after: false },
        for: { after: false },
        while: { after: false },
      },
    }],
    quotes: ['error', 'single'],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-member-accessibility': ['warn', {
      accessibility: 'no-public',
    }],
    'react/jsx-filename-extension': ['error', {
      extensions: ['.tsx', '.jsx'],
    }],
    'react/destructuring-assignment': 'off',
    'react/forbid-component-props': ['warn', { forbid: ['style'] }],
    'react/forbid-dom-props': ['warn', { forbid: ['style'] }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    // Disable this rule as it has been marked as deprecated in jsx-a11y plugin
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/releases/tag/v6.1.0
    'jsx-a11y/label-has-for': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
