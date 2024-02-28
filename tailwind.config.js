/** @type {import('tailwindcss').Config} */ module.exports = {
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
      gridTemplateRows: { layout: 'h-min 1fr' },
      fontFamily: {
        sans: ['Forma DJR Micro'],
        mono: ['IBM Plex Mono'],
        emoji: ['Segoe UI Emoji'],
      },
      colors: {
        primary: '#51A1F8',
        'primary-content': '#000',
        secondary: '#D3D3D7',
        'secondary-content': '#000',
        neutral: '#F8E268',
        'neutral-content': '#000',
        'base-100': '#f4eddd',
        success: '#5ECC7B',
        'success-content': '#000',
        warning: '#E68E33',
        'warning-content': '#000',
        error: '#FF5E4D',
        'error-content': '#000',
        'text-neutral-content' : "#000"
      }
    },
  },
  daisyui: {
    themes: [
      {
        emerald: {
          primary: '#51A1F8',
          'primary-content': '#000',
          secondary: '#D3D3D7',
          'secondary-content': '#000',
          neutral: '#F8E268',
          'neutral-content': '#000',
          'base-100': '#f4eddd',
          success: '#5ECC7B',
          'success-content': '#000',
          warning: '#E68E33',
          'warning-content': '#000',
          error: '#FF5E4D',
          'error-content': '#000',
          '--rounded-box': '0rem',
          '--rounded-btn': '0rem',
          '--rounded-badge': '0rem',
          '--animation-btn': '0s',
          '--animation-input': '0s',
          '--btn-text-case': 'uppercase',
          '--navbar-padding': '0rem',
          '--border-btn': '0px',
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
      'retro',
      'cyberpunk',
      'night',
    ],
  },
  plugins: [require('daisyui')],
  darkMode: 'class',
};

// {
//   teddys: {
//     primary: '#115e59',
//     'primary-content': '#fff',
//     secondary: '#ff7e00',
//     'secondary-content': '#fff',
//     neutral: '#1f2937',
//     'neutral-content': '#fff',
//     'base-100': '#fff',
//     success: '#16a34a',
//     'success-content': '#fff',
//     warning: '#ff7e00',
//     'warning-content': '#fff',
//     error: '#b91c1c',
//     'error-content': '#fff',
//     '--rounded-box': '0.5rem',
//     '--rounded-btn': '0.25rem',
//     '--rounded-badge': '0.5rem',
//     '--animation-btn': '0s',
//     '--animation-input': '0s',
//     '--btn-text-case': 'uppercase',
//     '--navbar-padding': '.5rem',
//     '--border-btn': '0px',
//   },
// },
