import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  plugins: [
    vue(),
    libInjectCss(),
    dts({
      entryRoot: 'src',
      include: ['src'],
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('src/index.ts', import.meta.url)),
        setup: fileURLToPath(new URL('src/setup.ts', import.meta.url)),
        'config/index': fileURLToPath(new URL('src/config/index.ts', import.meta.url)),
        'config/vue': fileURLToPath(new URL('src/config/vue.ts', import.meta.url)),
        'config/nuxt': fileURLToPath(new URL('src/config/nuxt.ts', import.meta.url)),
        'config/nuxt-layers': fileURLToPath(new URL('src/config/nuxt-layers.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@histoire/plugin-nuxt',
        '@histoire/plugin-vue',
        '@nuxt/kit',
        '@rhapsodic/bem-classnames-vue',
        'histoire',
        'node:fs',
        'node:path',
        'vue',
      ],
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
