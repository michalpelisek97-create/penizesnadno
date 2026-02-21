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
    // 1. TOTÁLNÍ INLINING: Zvedáme limit na 250KB.
    // Tím zajistíme, že CSS i menší obrázky/ikony budou přímo v JS.
    // Zmizí samostatný požadavek na style.css, který měl latenci 936ms.
    assetsInlineLimit: 256000, 
    
    // 2. KONEC ŘETĚZENÍ: Žádné rozdělování souborů.
    cssCodeSplit: false,

    // 3. AGRESIVNÍ MINIFIKACE:
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        toplevel: true 
      }
    },

    rollupOptions: {
      output: {
        // Vše do jednoho balíku 'index.js'
        manualChunks: undefined, 
        entryFileNames: `assets/index.js`,
        chunkFileNames: `assets/index.js`,
        assetFileNames: `assets/[name].[ext]`,
        // Odstraní nepotřebné importy v hlavičce souborů
        hoistTransitiveImports: false
      },
    },
  },
})
