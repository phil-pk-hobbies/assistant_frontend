import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // any request that starts with /api → forward to Django
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,     // sets Host header = 127.0.0.1
        secure: false,          // allow http (not https)
      },
    },
  },
});