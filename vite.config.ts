import { defineConfig } from 'vite';

export default defineConfig({
  base: '/rocos-web/',
  build: { rollupOptions: { output: { manualChunks: { three: ['three'] } } } },
});
