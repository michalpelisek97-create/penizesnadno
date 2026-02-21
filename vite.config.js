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
    // 1. ZABRÁNÍ BLOKOVÁNÍ CSS (INLINING): 
    // Nastaveno na 30 KB (30720 bajtů). Protože tvé CSS má 12,7 KB, 
    // Vite ho nyní vloží přímo do HTML/JS. Tím zmizí hláška o blokujícím požadavku 
    // a ušetříš 320 ms latence při startu webu.
    assetsInlineLimit: 30720, 
    
    // 2. Rozdělí zbývající CSS podle stránek pro lepší výkon
    cssCodeSplit: true,

    // 3. Pokročilá minifikace pro nejmenší možnou velikost souborů
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Vyčistí kód od vývojářských logů
        drop_debugger: true
      }
    },

    rollupOptions: {
      output: {
        // 4. ROZDĚLENÍ KÓDU (CHUNKS): Sníží váhu úvodní stránky
        manualChunks(id) {
          // Těžké knihovny (3D, PDF, Grafy)
          if (id.includes('three') || id.includes('jspdf') || id.includes('html2canvas') || id.includes('recharts')) {
            return 'visual-assets';
          }
          // Nástroje (Mapy, Editory)
          if (id.includes('leaflet') || id.includes('quill')) {
            return 'interactive-tools';
          }
          // Platby
          if (id.includes('stripe')) {
            return 'payments';
          }
          // Základní frameworky (React, Radix, Framer Motion)
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
