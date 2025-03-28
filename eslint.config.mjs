import { FlatCompat } from '@eslint/eslintrc';
import tsRules from './lint/ts-rules.mjs';
import esRules from './lint/es-rules.mjs';
import { globalIgnores } from 'eslint/config';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  globalIgnores([
    '**/app/(payload)/*',
    '**/convenience/*',
    '**/node_modules/*',
  ]),
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:storybook/recommended'),
  {
    files: [
      '**/*.mjs',
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
    ],
    rules: {
      ...esRules,
      ...tsRules,
    },
  },
];

export default eslintConfig;
