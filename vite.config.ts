import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['1ca5-103-148-20-157.ngrok-free.app'], // Add your ngrok domain here
  },
})
