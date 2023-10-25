import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

/* eslint-disable no-template-curly-in-string */
export default defineConfig((command, mode) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      port: 3000,
      proxy: {
        '/api/socket': `wss://${env.REACT_APP_URL_NAME}`,
        '/api': `https://${env.REACT_APP_URL_NAME}`,
      },
    },
    build: {
      outDir: 'build',
    },
    plugins: [
      svgr(),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          navigateFallbackDenylist: [/^\/api/],
        },
        manifest: {
          short_name: env.APP_NAME,
          name: 'Tonbridge Traccar',
          theme_color: '#000000',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
  }
});
