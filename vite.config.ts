import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['688e5e0af1031e3fe7b63737981fb9f6.jpg', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Maison Crocs',
        short_name: 'Maison Crocs',
        description: 'Admin App for Maison Crocs',
        theme_color: '#ffffff',
        icons: [
          {
            src: '688e5e0af1031e3fe7b63737981fb9f6.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: '688e5e0af1031e3fe7b63737981fb9f6.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ],
        start_url: '/admin',
        scope: '/admin',
        display: 'standalone',
        orientation: 'portrait'
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
