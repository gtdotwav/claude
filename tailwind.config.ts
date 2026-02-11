import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0f172a', light: '#1e293b', accent: '#6366f1' },
        ig: { DEFAULT: '#E1306C', gradient1: '#833AB4', gradient2: '#FD1D1D', gradient3: '#F77737' },
      },
    },
  },
  plugins: [],
};
export default config;
