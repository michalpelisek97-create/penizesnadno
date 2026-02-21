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
    // 1. ŘEŠENÍ BLOKUJÍCÍHO CSS:
    // Zvedneme limit na 40KB. Vaše CSS má 12.7KB, takže se teď "vstřebá" do JS souboru.
    // Prohlížeč pak stahuje o 1 soubor méně (zmizí ta 695ms latence pro CSS).
    assetsInlineLimit: 40960, 
    
    // 2. MODERNI STRATEGIE NAČÍTÁNÍ:
    // Vite automaticky generuje <link rel="modulepreload"> do index.html.
    modulePreload: {
      polyfill: true
    },

    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },

    rollupOptions: {
      output: {
        // 3. OPTIMALIZACE VENDOR CHUNK:
        // Pomůže snížit velikost hlavního index.js tím, že knihovny dá stranou.
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          // Pokud máte další velké knihovny, nechte je v manualChunks níže
        }
      },
    },
  },
})
