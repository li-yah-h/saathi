import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Heat scale used by the Spatial Intensity Matrix (cold -> hot).
        heat: {
          0: '#eef2f7', // untouched
          1: '#cfe8ff', // low use
          2: '#8fc7ff', // moderate
          3: '#4ea1f0', // frequent
          4: '#f0a83c', // very frequent
          5: '#e0523d', // locked / muscle-memory tile
        },
      },
    },
  },
  plugins: [],
};
export default config;
