import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/fast-aggregate-calculator",
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
