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
      proxy: {
        '/api': {
          target: 'http://localhost:8000', // Laravel API server
          changeOrigin: true,
          secure: false,
          credentials: true,
        },
      },
    },
    define: {
      // Make .env variables available at runtime
      'process.env.REACT_APP_PUSHER_KEY': JSON.stringify(env.REACT_APP_PUSHER_KEY),
      'process.env.REACT_APP_PUSHER_CLUSTER': JSON.stringify(env.REACT_APP_PUSHER_CLUSTER),
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
    }
  }
});