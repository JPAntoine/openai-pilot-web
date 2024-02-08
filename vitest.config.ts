import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      // Your existing test configuration
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',     
      coverage: {
        exclude: [
            "src/testing/*",
            "src/build/*",
            "src/**/*.tsx",
            "**/*.cjs",
            "**/*config*",
            "**/index*"
        ]
      }
    },
  });
