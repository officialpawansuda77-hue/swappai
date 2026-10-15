import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.vercel', 'scripts', 'supabase/functions', '.agents'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['api/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.node },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // Pre-existing code written before lint was enforced. These files are being
    // replaced phase by phase (Konva editor, design schema); keep issues visible
    // as warnings without blocking CI. New files must not be added here.
    files: [
      'src/App.tsx',
      'src/components/admin/**',
      'src/components/common/CookieConsent.tsx',
      'src/components/editor/**',
      'src/components/marketing/FAQSection.tsx',
      'src/contexts/AuthContext.tsx',
      'src/hooks/useEditorStore.ts',
      'src/lib/adminApi.ts',
      'src/lib/adminUtils.ts',
      'src/lib/analytics.ts',
      'src/lib/exportSlide.ts',
      'src/pages/**',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
);
