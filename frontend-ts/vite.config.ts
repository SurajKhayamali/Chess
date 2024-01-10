// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  base: './',
  publicDir: '../public',
  resolve: {
    alias: {
      auth: resolve(__dirname, 'src/auth'),
      components: resolve(__dirname, 'src/components'),
      constants: resolve(__dirname, 'src/constants'),
      entities: resolve(__dirname, 'src/entities'),
      enums: resolve(__dirname, 'src/enums'),
      helpers: resolve(__dirname, 'src/helpers'),
      interfaces: resolve(__dirname, 'src/interfaces'),
      pages: resolve(__dirname, 'src/pages'),
      scripts: resolve(__dirname, 'src/scripts'),
      services: resolve(__dirname, 'src/services'),
    },
  },
});
