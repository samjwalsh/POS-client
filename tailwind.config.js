/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,jsx}'],
  theme: {
    borderWidth: {
      DEFAULT: '1px',
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
        light_background: '#ffffff',
        // light_primary: '#00b5ff',
        // light_primary_border: '#00b5ff',
        // light_secondary: '#ffbe00',
        // light_secondary_border: '#ffbe00',
        // light_negative: '#ff5861',
        // light_negative_border: '#ff5861',
        // light_positive: '#00a96e',
        // light_positive_border: '#00a96e',
        // light_grey: '#c7c8c8',
        // light_grey_border: '#c7c8c8',
        light_grey_divider: '#bbb',
        dark_background: '#1d232a',
        // dark_primary: '#00b5ff',
        // dark_primary_border: '#00b5ff',
        // dark_secondary: '#ffbe00',
        // dark_secondary_border: '#ffbe00',
        // dark_negative: '#ff5861',
        // dark_negative_border: '#ff5861',
        // dark_positive: '#00a96e',
        // dark_positive_border: '#00a96e',
        // dark_grey: '#232a33',
        // dark_grey_border: '#232a33',
        dark_grey_divider: '#3f3f46',
      },
    },
  },
  daisyui: {
    themes: [
      'dark',
      'emerald',
      {
        teddys: {
          primary: '#115e59',
          'primary-content': '#fff',
          secondary: '#ff7e00',
          'secondary-content': '#fff',
          neutral: '#1f2937',
          'neutral-content': '#fff',
          'base-100': '#fff',
          success: '#16a34a',
          'success-content': '#fff',
          warning: '#ff7e00',
          'warning-content': '#fff',
          error: '#b91c1c',
          'error-content': '#fff',

          '--rounded-box': '0.5rem',
          '--rounded-btn': '0.25rem',
          '--rounded-badge': '0.5rem',
          '--animation-btn': '0s',
          '--animation-input': '0s',
          '--btn-text-case': 'uppercase',
          '--navbar-padding': '.5rem',
          '--border-btn': '0px',
        },
      },
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'black',
      'business',
      'night',
    ],
  },
  plugins: [require('daisyui')],
  darkMode: 'class',
};
