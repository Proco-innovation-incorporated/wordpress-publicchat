import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    DefineOptions(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
  },
  build: {
    manifest: false,
    souremap: false,
    minify: false,
    chunkSizeWarningLimit: 5000,
  },
});
