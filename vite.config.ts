import { defineConfig } from "vite";

// On GitHub Pages, the site is served from /<repo>/ (project page).
// Set BASE_PATH env in CI so the same config works for local dev (default '/').
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
  server: {
    host: true,
    port: 5173,
  },
});
