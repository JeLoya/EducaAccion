import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Si tu vite.config.js ya existe, solo agrega el bloque "server".
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:4000" } },
});
