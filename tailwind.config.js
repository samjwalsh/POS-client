/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: ['./src/**/*.{html,jsx}'],
  theme: {
    borderWidth : {
      DEFAULT: '2px',
      '0': '0',
      '2': '2px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    extend: {
      gridTemplateRows: {
        layout: 'h-min 1fr',
      },
      fontFamily: {
        sans: ['Gabarito', 'Roboto'],
        mono: ['Roboto Mono', 'Roboto Mono'],
        emoji: ['Segoe UI Emoji'],
      },
      colors: {
        // light_background: "#ffffff",
        // light_primary: "#FBBF24",
        // light_primary_border: "#FBBF24",
        // light_secondary: "#",
        // light_secondary_border: "#",
        // light_negative: "#F87171",
        // light_negative_border: "#F87171",
        // light_positive: "#34D399",
        // light_positive_border: "#34D399",
        // light_grey: "#D1D5DB",
        // light_grey_border: "#D1D5DB",
        // light_grey_divider: "#737373",
        // dark_background: "#18181b",
        // dark_primary: "#0F766E",
        // dark_primary_border: "#0F766E",
        // dark_secondary: "#3f3f46",
        // dark_secondary_border: "#3f3f46",
        // dark_negative: "#b91c1c",
        // dark_negative_border: "#b91c1c",
        // dark_positive: "#16A34A",
        // dark_positive_border: "#16A34A",
        // dark_grey: "#3f3f46",
        // dark_grey_border: "#3f3f46",
        // dark_grey_divider: "#737373",
        //
        // light_background: "#ffffff",
        // light_primary: "#FBBF24",
        // light_primary_border: "#FDE68A",
        // light_secondary: "#",
        // light_secondary_border: "#",
        // light_negative: "#F87171",
        // light_negative_border: "#FECACA",
        // light_positive: "#34D399",
        // light_positive_border: "#A7F3D0",
        // light_grey: "#D1D5DB",
        // light_grey_border: "#E5E7EB",
        // light_grey_divider: "#737373",
        // dark_background: "#18181b",
        // dark_primary: "#0F766E",
        // dark_primary_border: "#134E4A",
        // dark_secondary: "#3f3f46",
        // dark_secondary_border: "#27272a",
        // dark_negative: "#DC2626",
        // dark_negative_border: "#991B1B",
        // dark_positive: "#16A34A",
        // dark_positive_border: "#166534",
        // dark_grey: "#3f3f46",
        // dark_grey_border: "#27272a",
        // dark_grey_divider: "#737373",

        // 400 and 800 border for light
        light_background: '#ffffff',
        light_primary: '#14b8a6',
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
        dark_background: '#18181b',
        dark_primary: '#115e59',
        dark_primary_border: '#115e59',
        dark_secondary: '#9a3412',
        dark_secondary_border: '#9a3412',
        dark_negative: '#991b1b',
        dark_negative_border: '#991b1b',
        dark_positive: '#166534',
        dark_positive_border: '#166534',
        dark_grey: '#27272a',
        dark_grey_border: '#27272a',
        dark_grey_divider: '#3f3f46',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
