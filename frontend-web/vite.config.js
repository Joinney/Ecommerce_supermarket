import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Tương đương với --host, cho phép truy cập từ ngoài
    port: 5173,
    // --- THÊM ĐOẠN NÀY VÀO ---
    allowedHosts: [
      'host.docker.internal',
      'localhost'
    ]

  }
})