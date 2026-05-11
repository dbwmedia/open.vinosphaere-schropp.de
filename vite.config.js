import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    build: {
      outDir: 'build',
      emptyOutDir: true,
      manifest: true,
      sourcemap: isDev,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/js/main.js'),
          style: resolve(__dirname, 'src/scss/main.scss'),
        },
        output: {
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.css')) {
              return 'css/[name].[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
          },
        },
      },
      minify: !isDev,
    },
    css: {
      devSourcemap: isDev,
    },
    server: {
      host: 'localhost',
      port: 3000,
      strictPort: false,
      open: false,
    },
  };
});
