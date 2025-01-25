import globals from 'globals'
import pluginJs from '@eslint/js'

export const commonEslintConfig = [
  pluginJs.configs.recommended, {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        ...globals.browser,
      },
    },
    rules: {
      'quotes': ['warn', 'single'],
      'semi': ['warn', 'never'],
      'no-trailing-spaces': ['warn'],
      'no-unused-vars': ['warn', {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
      }],
    },
  }, {
    ignores: ['dist/*'],
  },
]
