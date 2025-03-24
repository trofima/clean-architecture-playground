import globals from 'globals'
import pluginJs from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

export const commonEslintConfig = [
  pluginJs.configs.recommended, {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        ...globals.browser,
      },
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      'no-unused-vars': ['warn', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
      }],
      'curly': ['warn', 'multi'],
      'no-empty-function': 'off',
      '@stylistic/js/quotes': ['warn', 'single'],
      '@stylistic/js/semi': ['warn', 'never'],
      '@stylistic/js/no-trailing-spaces': ['warn'],
      '@stylistic/js/indent': ['warn', 2, {'flatTernaryExpressions': true}],
      '@stylistic/js/no-multi-spaces': ['warn', {'exceptions': {'Property': false}}],
      '@stylistic/js/comma-spacing': ['warn'],
      '@stylistic/js/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/js/object-curly-spacing': ['warn', 'never'],
      '@stylistic/js/space-in-parens': ["warn", "never"],
      '@stylistic/js/quote-props': ["warn", "as-needed"],
    },
  }, {
    ignores: ['dist/*'],
  },
]
