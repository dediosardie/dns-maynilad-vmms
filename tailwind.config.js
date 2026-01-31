/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0B0B',
          secondary: '#121212',
          elevated: '#1A1A1A',
        },
        border: {
          muted: '#2A2A2A',
        },
        text: {
          primary: '#E5E5E5',
          secondary: '#B3B3B3',
          muted: '#8A8A8A',
          disabled: '#5A5A5A',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#FB923C',
          soft: 'rgba(249, 115, 22, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
};
