import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      sourcemap: true,
    },
    server: {
      open: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
    ],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "@testing-library/jest-dom",
      mockReset: true,
      coverage: {
        reporter: ["text", "lcov"],
      },
      reporters: ["vitest-sonar-reporter"],
      outputFile: {
        "vitest-sonar-reporter": "coverage/sonar-report.xml",
      },
    },
  };
});
