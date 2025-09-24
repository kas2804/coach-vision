/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-orange': '#FF7900',
        'brand-orange-light': '#FFA500',
        'brand-orange-dark': '#F94D00',
        'brand-black': '#000000',
        'brand-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
};
