import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/fast-aggregate-calculator/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
