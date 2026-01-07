import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { shikiPlugin } from './vite-plugin-shiki.js';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'src/public'),

    plugins: [
      handlebars({
        partialDirectory: resolve(__dirname, 'src/features'),
        context: {
          mainUrl: env.VITE_MAIN_URL,
          soupapeUrl: env.VITE_SOUPAPE_URL,
        },
      }),
      shikiPlugin(),
    ],

    resolve: {
      alias: {
        '@shared': resolve(__dirname, '../../shared'),
        '@styles': resolve(__dirname, '../../shared/styles'),
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          includePaths: [resolve(__dirname, '../../shared/styles')],
        },
      },
    },

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },

    server: {
      port: 3001,
      strictPort: true,
      host: '0.0.0.0',
    },
  };
});
