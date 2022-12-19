module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: [
    'standard',
    'plugin:prettier/recommended',
    'plugin:node/recommended',
    'eslint:recommended',
    'plugin:promise/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['promise'],
  rules: {
    'prettier/prettier': ['error', { printWidth: 120, tabWidth: 2, singleQuote: true }],
    'max-len': ['warn', { code: 120 }],
    'promise/always-return': 'error',
    'promise/catch-or-return': 'error',
    'default-case': 'error',
    'promise/no-nesting': 'off',
    'node/no-unpublished-require': 'off',
    'no-useless-return': 'off',
    'no-unused-vars': 'warn',
    'no-var': 'off',
    'no-console': 'warn',
    quotes: 'off',
    'no-catch-shadow': 'error',
    'no-shadow': 'error',
    'no-shadow-restricted-names': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-duplicate-imports': 'error',
    'new-cap': 'error',
    'no-magic-numbers': 'warn',
    'spaced-comment': 'off',
  },
  globals: {
    NUMBER_ZERO: true,
  },
  overrides: [
    {
      files: ['hardhat.config.js'],
      globals: { task: true },
    },
  ],
};
