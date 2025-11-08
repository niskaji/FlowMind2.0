// .eslintrc.js
module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-native', '@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
    'import/ignore': ['react-native'],
  },
  rules: {
    // --- React / React Native Kuralları ---
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/no-raw-text': 'off',

    // --- TypeScript Kuralları ---
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^Colors$', // 👈 Colors importu asla silinmez
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn', // 👈 artık hata değil, sadece uyarı

    // --- Import Düzeni ---
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-unresolved': 'off',

    // --- React Native Style & Color Literals ---
    'react-native/sort-styles': 'off',
    'react-native/no-color-literals': 'error', // 👈 inline renk kullanımı hata olarak kalır

    // --- Genel Kurallar ---
    'no-console': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.expo/', 'android/', 'ios/'],
};
