import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { interpolatePlugin } from '../../shared/plugins/vite-plugin-interpolate.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'src/public'),

    plugins: [
      interpolatePlugin({
        context: {
          peritypeUrl: env.VITE_PERITYPE_URL,
          soupapeUrl: env.VITE_SOUPAPE_URL,
        },
      }),
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
    },

    server: {
      port: 3000,
      strictPort: true,
      host: '0.0.0.0',
    },
  };
});
