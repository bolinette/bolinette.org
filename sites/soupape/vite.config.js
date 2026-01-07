import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
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
          title: 'Soupape | Bolinette',
          description: 'Soupape - Bolinette',
          siteName: 'Soupape',
          mainUrl: env.VITE_MAIN_URL || 'http://localhost:3000',
          peritypeUrl: env.VITE_PERITYPE_URL || 'http://localhost:3001',
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
      port: 3002,
      strictPort: true,
      host: '0.0.0.0',
    },
  };
});
