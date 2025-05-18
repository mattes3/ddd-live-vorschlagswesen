import { readdirSync } from 'fs';
import { extname, join, normalize, resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const webDir = normalize(join(__dirname, './src'));
const outDir = normalize(join(__dirname, '../dist/web/src'));

let pages = readdirSync(webDir).filter((f) => extname(f) === '.html');

let inputs = pages.reduce((config, page) => {
    config[page] = resolve(webDir, page);
    return config;
}, {});

export default defineConfig({
    root: webDir,
    appType: 'mpa',
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
                    src: 'scripts/*htmx*.js',
                    dest: './assets/js',
                },
                {
                    src: '../../../../node_modules/@shoelace-style/shoelace/dist/assets/icons/*',
                    dest: './assets/icons',
                },
                {
                    src: '*.xml',
                    dest: '.',
                },
                {
                    src: 'partials',
                    dest: '.',
                },
                {
                    src: 'favicon',
                    dest: '.',
                },
                {
                    src: 'favicon/site.webmanifest',
                    dest: '.',
                },
            ],
        }),
    ],
});
