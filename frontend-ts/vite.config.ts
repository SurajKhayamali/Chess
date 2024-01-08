// vite.config.js
import path, { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  base: './',
  publicDir: '../public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'auth/login/index.html'),
        register: resolve(__dirname, 'auth/register/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      sass: path.resolve(__dirname, 'src/styles/sass'),
      scripts: path.resolve(__dirname, 'src/scripts'),
    },
  },
});
