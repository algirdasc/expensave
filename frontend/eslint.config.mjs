import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import pluginQuery from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['projects/**/*', 'dist/**/*', 'node_modules/**/*'],
    },

    // TanStack Query recommended rules
    ...pluginQuery.configs['flat/recommended'],

    // TypeScript files
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ['tsconfig.json'],
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            '@angular-eslint': angular,
            prettier,
        },
        rules: {
            // ESLint base
            ...eslint.configs.recommended.rules,

            // TypeScript recommended
            ...tseslint.configs.recommended.reduce((acc, cfg) => ({ ...acc, ...cfg.rules }), {}),

            // Angular recommended
            ...angular.configs.recommended.rules,

            // Prettier (disable conflicting rules, then enable)
            ...prettierConfig.rules,
            'prettier/prettier': 'error',

            // Angular: selectors
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],

            // Angular: lifecycle & quality
            '@angular-eslint/no-empty-lifecycle-method': 'error',
            '@angular-eslint/use-lifecycle-interface': 'error',
            '@angular-eslint/contextual-lifecycle': 'error',
            '@angular-eslint/no-conflicting-lifecycle': 'error',
            '@angular-eslint/use-pipe-transform-interface': 'error',
            '@angular-eslint/prefer-output-readonly': 'warn',
            '@angular-eslint/no-output-native': 'error',
            '@angular-eslint/no-output-on-prefix': 'error',
            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/no-output-rename': 'error',
            '@angular-eslint/sort-lifecycle-methods': 'warn',
            '@angular-eslint/use-injectable-provided-in': 'warn',

            // TypeScript: type safety & style
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/method-signature-style': 'error',
            '@typescript-eslint/member-ordering': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'no-unused-vars': 'off',
            'sort-vars': 'error',
        },
    },

    // HTML templates
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: angularTemplateParser,
        },
        plugins: {
            '@angular-eslint/template': angularTemplate,
            prettier,
        },
        rules: {
            // Angular template recommended
            ...angularTemplate.configs.recommended.rules,

            // Angular template quality
            '@angular-eslint/template/no-duplicate-attributes': 'error',
            '@angular-eslint/template/no-negated-async': 'error',
            '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }],
            '@angular-eslint/template/prefer-self-closing-tags': 'warn',
            '@angular-eslint/template/prefer-control-flow': 'warn',
            '@angular-eslint/template/no-call-expression': 'warn',

            // Accessibility
            '@angular-eslint/template/alt-text': 'warn',
            '@angular-eslint/template/button-has-type': 'warn',
            '@angular-eslint/template/click-events-have-key-events': 'warn',
            '@angular-eslint/template/interactive-supports-focus': 'warn',
            '@angular-eslint/template/elements-content': 'warn',

            // Prettier for templates
            'prettier/prettier': [
                'error',
                {
                    parser: 'angular',
                },
            ],
        },
    }
);
