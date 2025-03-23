import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [react()],
    server: {
      port: 5173, // Explicitly set port
      strictPort: false, // Try different port if 5173 is in use
      host: true, // Listen on all addresses
      cors: true, // Enable CORS
      hmr: {
        host: 'localhost',
        protocol: 'ws',
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8000', // Laravel API server
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/sanctum': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        '/broadcasting': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        '/send-message': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      // Make .env variables available at runtime
      'process.env.REACT_APP_PUSHER_KEY': JSON.stringify(env.REACT_APP_PUSHER_KEY || '1095a51e72cc082abbab'),
      'process.env.REACT_APP_PUSHER_CLUSTER': JSON.stringify(env.REACT_APP_PUSHER_CLUSTER || 'eu'),
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL || 'http://localhost:8000'),
    }
  }
});