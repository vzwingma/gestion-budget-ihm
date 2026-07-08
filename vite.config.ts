/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/setupTests.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            reportsDirectory: 'coverage',
        },
        // Node 22+ exposes an experimental global `localStorage`/`sessionStorage` which shadows
        // jsdom's own implementation (missing `.clear()` etc). Disable it so jsdom's Storage wins.
        poolOptions: {
            forks: {
                execArgv: ['--no-experimental-webstorage'],
            },
        },
    },
});
