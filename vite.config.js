import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', 
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      visualEditAgent: true
    }),
    react(),
  ],
  build: {
    // Zapneme pokročilou minifikaci
    minify: 'terser',
    rollupOptions: {
      output: {
        // Rozdělení kódu na logické celky
        manualChunks(id) {
          // 1. Všechny těžké vizuální a PDF knihovny dáme bokem
          if (id.includes('three') || id.includes('jspdf') || id.includes('html2canvas') || id.includes('recharts')) {
            return 'visual-assets';
          }
          // 2. Mapy a editor
          if (id.includes('leaflet') || id.includes('quill')) {
            return 'interactive-tools';
          }
          // 3. Platební brána Stripe
          if (id.includes('stripe')) {
            return 'payments';
          }
          // 4. Základní UI komponenty (Radix, Framer Motion)
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
