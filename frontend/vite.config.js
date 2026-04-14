import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/games": "http://localhost:8000",
      "/odds": "http://localhost:8000",
      "/edges": "http://localhost:8000",
    },
  },
});
