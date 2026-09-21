import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d9f3ff',
          500: '#2d88ff',
          600: '#1d6fe5',
          700: '#1457b8'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(26, 52, 91, 0.12)'
      }
    },
  },
  plugins: [],
};

export default config;
