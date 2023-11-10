/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
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
      colors: {
        light_background: "#ffffff",
        light_primary: "#FBBF24",
        light_primary_border: "#FDE68A",
        light_secondary: "#",
        light_secondary_border: "#",
        light_negative: "#F87171",
        light_negative_border: "#FECACA",
        light_positive: "#34D399",
        light_positive_border: "#A7F3D0",
        light_grey: "#D1D5DB",
        light_grey_border: "#E5E7EB",
        light_grey_divider: "#737373",
        dark_background: "#18181B",
        dark_primary: "#0F766E",
        dark_primary_border: "#134E4A",
        dark_secondary: "#",
        dark_secondary_border: "#",
        dark_negative: "#DC2626",
        dark_negative_border: "#991B1B",
        dark_positive: "#16A34A",
        dark_positive_border: "#166534",
        dark_grey: "#52525B",
        dark_grey_border: "#27272A",
        dark_grey_divider: "#737373",
      }
    },
  },
  plugins: [],
  darkMode: 'class',

};
