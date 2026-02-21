import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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
    // 1. ELIMINACE BLOKUJÍCÍHO CSS:
    // Limit 40KB zajistí, že se vaše 12.7KB CSS vloží přímo do JS.
    // Tím zmizí samostatný síťový požadavek na CSS a zrychlí se vykreslení.
    assetsInlineLimit: 40960, 
    
    // 2. AUTOMATICKÝ PRELOAD:
    // Vite sám vloží <link rel="modulepreload"> do index.html pro hlavní JS balíčky.
    modulePreload: {
      polyfill: true
    },

    // 3. AGRESIVNÍ MINIFIKACE:
    // Terser odstraní nepotřebný kód a logy, což zmenší velikost stahovaných zdrojů.
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'] // Odstraní i specifické logy
      }
    },

    rollupOptions: {
      output: {
        // 4. CHUNKING (ROZDĚLENÍ KÓDU):
        // Oddělíme React od vašeho kódu. Prohlížeč si React uloží do mezipaměti 
        // a při aktualizaci vašeho webu ho nebude muset stahovat znovu.
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['axios'] // Pokud používáte axios, přidejte ho sem
        }
      },
    },
  },
})
