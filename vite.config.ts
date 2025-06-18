import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    build: {
        rollupOptions: {
            input: {
                // English entry point (will be output to dist/index.html)
                main: resolve(__dirname, 'index.html'),
                // Russian entry point (will be output to dist/index-ru.html)
                ru: resolve(__dirname, 'index-ru.html'),
            },
        },
    },
});
