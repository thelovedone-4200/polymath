import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Suppress warnings for chunks under 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split recharts into its own chunk (large dependency)
          recharts: ['recharts'],
          // Split lucide-react icons into separate chunk
          icons: ['lucide-react'],
          // Core React and vendor code
          vendor: ['react', 'react-dom']
        },
        // Optimize chunk names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})
