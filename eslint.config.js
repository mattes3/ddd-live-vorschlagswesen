// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/object-curly-spacing': 'off',
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/comma-dangle': 'off',
            '@typescript-eslint/brace-style': 'off',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unsafe-declaration-merging': 'off',
            '@typescript-eslint/consistent-type-assertions': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-useless-escape': 'off',
            'capitalized-comments': 'off',
            'padded-blocks': 'off',
            'no-empty-static-block': 'off',
            'no-new-native-nonconstructor': 'off',
            'arrow-body-style': 'off',
        },
    },
    {
        ignores: [
            "node_modules",
            "**/node_modules/*",
            "**/dist/*",
            "**/build/*",
            "build/*",
            "**/assets/*",
            "**/dynamodb_data",
            "**/sitemap*.xml",
            "**/*.html",
            "**/*.css",
            "**/*.csv",
            "**/*.sh",
            "**/*.js",
            "**/*.d.ts",
            "**/*.json",
            "**/*.jpg",
            "**/*.png",
            "**/*.ico",
            "**/*.gif",
            "**/*.svg",
            "**/*.webmanifest",
            "**/*.yml",
            "**/*.tf",
            "**/*.txt",
            "**/*.pxm",
            "**/*.sql",
            "**/*.md",
            "**/*.tsbuildinfo",
            "**/*.stub",
            "**/vite.config.mjs",
            "**/vitest.config.ts",
            "**/Caddyfile",
            "**/copyEnvironmentVariables.ts"
        ]
    }
);
