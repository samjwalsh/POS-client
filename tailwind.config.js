/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,jsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        layout: 'h-min 1fr',
      },
      fontFamily: {
        sans: ['Fira Sans', 'Roboto'],
        mono: ['Fira Mono', 'Roboto Mono'],
        emoji: ['Segoe UI Emoji']
      },
    },
  },
  plugins: [],
  darkMode: 'class',

};
