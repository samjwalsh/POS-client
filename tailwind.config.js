/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,jsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        layout: '2rem 1fr',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui'],
        serif: ['ui-serif', 'Georgia'],
        mono: ['Roboto Mono', 'SFMono-Regular']
      },
    },
  },
  plugins: [],
};
