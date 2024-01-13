/** @type {import('tailwindcss').Config} */ module.exports = {
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
      gridTemplateRows: { layout: 'h-min 1fr' },
      fontFamily: {
        sans: ['Rubik'],
        mono: ['Noto Sans Mono'],
        emoji: ['Segoe UI Emoji'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        emerald: {
          primary: '#41be6d',
          'primary-content': '#f9fafb',
          secondary: '#0452e3',
          'secondary-content': '#f9fafb',
          accent: '#d03516',
          'accent-content': '#f9fafb',
          neutral: '#333c4d',
          'neutral-content': '#f9fafb',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#f0f0f0',
          'base-content': '#333c4d',
          info: '#1c92f2',
          success: '#009485',
          warning: '#ff9900',
          error: '#ff5724',
          '--rounded-box': '0.5rem',
          '--rounded-btn': '.25rem',
          '--rounded-badge': '0.5rem',
          '--animation-btn': '0',
          '--animation-input': '0',
          '--btn-text-case': 'uppercase',
          '--navbar-padding': '.5rem',
          '--border-btn': '1px',
        },
      },
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
          '--rounded-box': '0rem',
          '--rounded-btn': '0rem',
          '--rounded-badge': '0.5rem',
          '--animation-btn': '0s',
          '--animation-input': '0s',
          '--btn-text-case': 'uppercase',
          '--navbar-padding': '.5rem',
          '--border-btn': '0px',
        },
      },
      'corporate',
      'retro',
      'cyberpunk',
      'night',
    ],
  },
  plugins: [require('daisyui')],
  darkMode: 'class',
};
