import { readdirSync } from 'fs';
import { extname, join, normalize, resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { resolveCommonPath } from '@vorschlagswesen/common-frontend';

const webDir = normalize(join(__dirname, './src'));
const outDir = normalize(join(__dirname, '../dist/frontend'));

let pages = readdirSync(webDir).filter((f) => extname(f) === '.html');

let inputs = pages.reduce((config, page) => {
    config[page] = resolve(webDir, page);
    return config;
}, {});

export default defineConfig({
    base: '/vorschlag',
    root: webDir,
    appType: 'mpa',
    resolve: {
        alias: {
            '@common': resolveCommonPath(), // Alias for imports from common-frontend
        },
    },
    build: {
        outDir,
        emptyOutDir: true,
        rollupOptions: {
            input: inputs,
            output: {
                hoistTransitiveImports: false,
                assetFileNames: (assetInfo) => {
                    let dotIndex = assetInfo.name.lastIndexOf('.');
                    let extType = assetInfo.name.substring(dotIndex + 1);
                    if (/png|jpe?g|webp|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img';
                    }
                    return `assets/${extType}/[name]-[hash][extname]`;
                },
                manualChunks: (id) => {
                    if (id.endsWith('.css')) {
                        // Create separate chunk for imported CSS from node modules
                        if (id.includes('node_modules')) {
                            return 'vendor';
                        }

                        // Create a separate chunk for each of our own CSS files
                        return (
                            'css-' +
                            id
                                .split('/')
                                .pop()
                                .replace(/\.css$/, '')
                        );
                    }
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
            },
        },
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'partials',
                    dest: '.',
                },
                {
                    src: resolveCommonPath('assets'),
                    dest: '.',
                },
                {
                    src: resolveCommonPath('scripts/*'),
                    dest: './assets/js',
                },
                {
                    src: resolveCommonPath('favicon'),
                    dest: '.',
                },
            ],
        }),
    ],
});
