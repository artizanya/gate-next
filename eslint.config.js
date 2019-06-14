// Hey Emacs, this is -*- coding: utf-8 -*-
/* global module */

// Inspired by the following resources:
// https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb
// https://github.com/flycheck/flycheck/issues/514
// https://github.com/cerner/eslint-config-terra

// To consider:
// https://www.npmjs.com/package/@liquid-labs/catalyst-scripts

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
    // 'max-len': ['warn', 80],
    'max-len': ['error', 80, { ignoreUrls: true }],
    'operator-linebreak': ['error', 'after'],
    // Let tide (or tsc) and js2-mode handle undefined variables
    // 'no-undef': 'off',
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
    'no-param-reassign': ['error', { props: false }],
    quotes: ['error', 'single'],
    // Let tide (or tsc) and js2-mode handle undefined variables
    // '@typescript-eslint/no-unused-vars': 'off',
    indent: 'off',
    '@typescript-eslint/indent': ['warn', 2],
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
