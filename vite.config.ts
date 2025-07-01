/* eslint import/no-extraneous-dependencies: ["error", { devDependencies: true }] */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/MediTrack/', // 👈 add this line
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});




