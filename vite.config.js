import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      // "/uploads": {
      //   target: "http://194.164.149.238:8000",
      //   changeOrigin: true,
      //   secure: false,
      // },
      // "/api": {
      //   target: "http://194.164.149.238:8000",
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      // },
    },
  },
});
