import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite config for the Jan Seva frontend prototype.
// The Tailwind plugin lets us style everything with utility classes
// without a separate postcss/tailwind.config.js setup.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
});
