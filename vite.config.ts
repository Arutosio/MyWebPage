import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

/**
 * Vite config
 * - `publicDir` points at the existing `Files/` folder so all the assets
 *   (videos, images, fonts) remain accessible as before without moving them.
 *   Files inside `Files/` are served at site root: `/Videos_webm/foo.webm`.
 */
export default defineConfig({
    plugins: [react(), tailwindcss()],
    publicDir: path.resolve(__dirname, 'Files'),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        host: true,
        strictPort: false,
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
    },
});
