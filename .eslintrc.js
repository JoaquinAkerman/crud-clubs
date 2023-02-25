module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  plugins: [],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    radix: 'off',
  },
};
