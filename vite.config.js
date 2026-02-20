import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', 
  plugins: [
    base44({
      // Podpora pro starší SDK importy
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      visualEditAgent: true
    }),
    react(),
  ],
  build: {
    // 1. ZABRÁNÍ BLOKOVÁNÍ CSS: Soubory pod 20kb se vloží přímo (inlining), 
    // což vyřeší tvou chybu "Počáteční vykreslení stránky blokují požadavky"
    assetsInlineLimit: 20480, 
    
    // 2. Rozdělí CSS podle stránek, aby se nenačítalo vše najednou
    cssCodeSplit: true,

    // 3. Pokročilá minifikace pro nejmenší možnou velikost souborů
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Odstraní console.logy pro čistší produkční kód
        drop_debugger: true
      }
    },

    rollupOptions: {
      output: {
        // 4. ROZDĚLENÍ JAVASCRIPTU (Chunks): Sníží množství "nepoužívaného JS"
        manualChunks(id) {
          // Těžké grafické a exportní knihovny (PDF, 3D, Grafy)
          if (id.includes('three') || id.includes('jspdf') || id.includes('html2canvas') || id.includes('recharts')) {
            return 'visual-assets';
          }
          // Interaktivní nástroje (Mapy, Textové editory)
          if (id.includes('leaflet') || id.includes('quill')) {
            return 'interactive-tools';
          }
          // Platební systémy
          if (id.includes('stripe')) {
            return 'payments';
          }
          // Ostatní knihovny z node_modules (React, Radix, Framer atd.)
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
