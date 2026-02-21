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
    // 1. MAXIMÁLNÍ INLINING (Zruší samostatný soubor CSS)
    // Protože máš latenci 865ms, nechceme žádné extra soubory. 
    // Vše do 100KB nacpeme do hlavního JS balíku.
    assetsInlineLimit: 102400, 
    
    // Zabráníme rozdělování CSS do malých souborů
    cssCodeSplit: false,

    // 2. RYCHLEJŠÍ NAČÍTÁNÍ
    modulePreload: {
      polyfill: false // Moderní prohlížeče ho nepotřebují, ušetříš pár KB
    },

    // 3. AGRESIVNÍ ZMENŠENÍ VELIKOSTI
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        toplevel: true // Více zkomprimuje názvy proměnných
      }
    },

    rollupOptions: {
      output: {
        // 4. JEDEN HLAVNÍ BALÍK (Odstraní řetězení)
        // Pro malý web je lepší mít vše v jednom 'index.js' než čekat na 3 menší.
        manualChunks: undefined, 
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      },
    },
  },
})
