import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        heat: {
          0: '#eef2f7', 
          1: '#cfe8ff',
          2: '#8fc7ff', 
          3: '#4ea1f0', 
          4: '#f0a83c',
          5: '#e0523d', 
        },
      },
    },
  },
  plugins: [],
};
export default config;
