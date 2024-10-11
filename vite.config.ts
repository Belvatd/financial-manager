import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc"; // Using SWC for faster builds
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Set up alias for easy imports
    },
  },
  test: {
    environment: 'jsdom', // Use jsdom for testing DOM elements
    globals: true, // Enable global variables
    setupFiles: './setupTests.ts', // Path to your setup file
    coverage: {
      provider: 'istanbul', // Use 'istanbul' for coverage reports
      reporter: ['text', 'json', 'html'], // Output formats for coverage reports
      reportsDirectory: './coverage', // Directory to store coverage reports
      exclude: ['node_modules/', 'test/'], // Exclude directories from coverage
    },
  },
});
