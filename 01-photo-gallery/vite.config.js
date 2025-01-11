import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js',
  },
});
