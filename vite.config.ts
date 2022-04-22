import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
  build: {
    outDir: '../dist',
  },
  publicDir: '../public',
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
    checker({ typescript: true }),
  ],
});
