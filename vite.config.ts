import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Pre-compress assets with Brotli (smaller than gzip ~15-20%)
    viteCompression({ algorithm: "brotliCompress", ext: ".br" }),
    // Gzip fallback for older servers
    viteCompression({ algorithm: "gzip", ext: ".gz" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Target modern browsers — removes unnecessary polyfills
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ["recharts"],
          "framer-motion": ["motion/react"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Split all Radix primitives into their own chunk
          "radix-ui": [
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          // Icons + command palette into separate chunks
          "lucide": ["lucide-react"],
          "cmdk": ["cmdk"],
        },
      },
    },
  },
});
