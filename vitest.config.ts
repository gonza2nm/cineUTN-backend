import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Para Node.js
    include: ['src/tests/integration/**/*.test.ts'], // Solo pruebas de integración
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
