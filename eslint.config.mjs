import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';

// Config ESLint flat (autonome), équivalente fonctionnellement à l'ancienne
// config CRA "eslintConfig": { "extends": ["react-app", "react-app/jest"] } :
// - règles JS/TS recommandées
// - règles React (JSX, jsx-runtime automatique React 19) + Hooks (rules-of-hooks, exhaustive-deps)
// - règles testing-library sur les fichiers de test
export default tseslint.config(
  {
    ignores: ['dist', 'build', 'coverage', 'node_modules', 'public'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // React 19 + TypeScript : les props sont déjà typées via les interfaces, pas besoin de prop-types
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Rétrogradées en warning (non bloquant CI) : la config CRA react-app n'imposait pas ces
      // règles en erreur ; les activer en 'error' d'un coup casserait le build sur du code
      // existant hors périmètre de cette migration (~259 occurrences). Laissées visibles pour
      // un nettoyage ultérieur ciblé, sans bloquer cette initiative de modernisation du socle build.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      'prefer-const': 'warn',
      // Autorise l'idiome `condition && (assignation)` déjà utilisé dans le code existant
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      // Stylistique (apostrophes non échappées en JSX) : absente de react-app CRA, non bloquante
      'react/no-unescaped-entities': 'warn',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/setupTests.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      'testing-library': testingLibraryPlugin,
    },
    rules: {
      ...testingLibraryPlugin.configs['flat/react'].rules,
    },
  },
);
