import config from './vite.config.js'
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const projectDir = resolve(fileURLToPath(new URL('.', import.meta.url)));

/**
 * @type {import('vite').UserConfig}
 */
export default Object.assign(config, {
    ssr: {
        noExternal: /./
    },

    base: "",

    build: {
        ...config.build,
        outDir: "public/build/server",
    },
    resolve: {
        // necessary because vue.ssrUtils is only exported on cjs modules
        alias: [
            {
                find: '@vue/runtime-dom',
                replacement: '@vue/runtime-dom/dist/runtime-dom.cjs.js'
            },
            {
                find: '@vue/runtime-core',
                replacement: '@vue/runtime-core/dist/runtime-core.cjs.js'
            },
            {
                find: '~',
                replacement: resolve(projectDir, 'assets'),
            }
        ]
    }
})