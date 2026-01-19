/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'steel-blue': {
          DEFAULT: 'var(--steel-blue)',
          'dark': 'var(--steel-blue-dark)',
          'light': 'var(--steel-blue-light)',
        },
        'industrial-orange': {
          DEFAULT: 'var(--industrial-orange)',
          'light': 'var(--industrial-orange-light)',
          'dark': 'var(--industrial-orange-dark)',
        },
        'steel-gray': {
          DEFAULT: 'var(--steel-gray)',
          'light': 'var(--steel-gray-light)',
          'dark': 'var(--steel-gray-dark)',
        },
        'charcoal': {
          DEFAULT: 'var(--charcoal)',
          'light': 'var(--charcoal-light)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      gridTemplateColumns: {
        'auto-fill-250': 'repeat(auto-fill, minmax(250px, 1fr))',
        'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'steel': '0 4px 6px -1px rgba(44, 62, 80, 0.1), 0 2px 4px -1px rgba(44, 62, 80, 0.06)',
        'steel-lg': '0 10px 15px -3px rgba(44, 62, 80, 0.1), 0 4px 6px -2px rgba(44, 62, 80, 0.05)',
        'orange': '0 4px 6px -1px rgba(230, 126, 34, 0.1), 0 2px 4px -1px rgba(230, 126, 34, 0.06)',
        'orange-lg': '0 10px 15px -3px rgba(230, 126, 34, 0.1), 0 4px 6px -2px rgba(230, 126, 34, 0.05)',
      }
    },
  },
  plugins: [],
};
