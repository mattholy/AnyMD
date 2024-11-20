import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'c8' as 'v8',
            reporter: ['text', 'json', 'html'],
        },
        alias: {
            '@': './src',
        },
    },
});
