import {commonEslintConfig} from '../../common-eslint.config.js'

export default {
  ...commonEslintConfig,
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {},
}