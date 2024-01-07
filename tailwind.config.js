/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: ['./src/**/*.{html,jsx}'],
  theme: {
    borderWidth: {
      DEFAULT: '2px',
      0: '0',
      2: '2px',
      4: '4px',
      6: '6px',
      8: '8px',
    },
    extend: {
      gridTemplateRows: {
        layout: 'h-min 1fr',
      },
      fontFamily: {
        sans: ['Rubik'],
        mono: ['Noto Sans Mono'],
        emoji: ['Segoe UI Emoji'],
      },
      colors: {
        // 400 and 800 border for light
        light_background: '#ffffff',
        light_primary: '#2dd4bf',
        light_primary_border: '#064e3b',
        light_secondary: '#f59e0b',
        light_secondary_border: '#78350f',
        light_negative: '#f87171',
        light_negative_border: '#7f1d1d',
        light_positive: '#22c55e',
        light_positive_border: '#14532d',
        light_grey: '#cbd5e1',
        light_grey_border: '#0f172a',
        light_grey_divider: '#000',
        dark_background: '#000',
        dark_primary: '#064e3b',
        dark_primary_border: '#14b8a6',
        dark_secondary: '#78350f',
        dark_secondary_border: '#f59e0b',
        dark_negative: '#7f1d1d',
        dark_negative_border: '#f87171',
        dark_positive: '#14532d',
        dark_positive_border: '#22c55e',
        dark_grey: '#0f172a',
        dark_grey_border: '#cbd5e1',
        dark_grey_divider: '#3f3f46',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
