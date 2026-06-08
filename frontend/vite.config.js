import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "window",
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
  },
});