import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "CallExpression[callee.object.name='localStorage'][callee.property.name='setItem'][arguments.0.value='access']",
          message: 'Do not store access token in localStorage',
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx,jsx,js}', '!src/components/ui/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXOpeningElement[name.name='button'] JSXAttribute[name.name='className']",
          message: 'Use <Button/> from DS',
        },
        {
          selector: "JSXOpeningElement[name.name='input'] JSXAttribute[name.name='className']",
          message: 'Use <Input/> from DS',
        },
      ],
    },
  },
)
