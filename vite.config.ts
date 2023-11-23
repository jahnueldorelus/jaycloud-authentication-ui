/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
  },
  resolve: {
    alias: {
      "@bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@app-types": path.resolve(__dirname, "./src/types"),
      "@views": path.resolve(__dirname, "./src/views"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
});
