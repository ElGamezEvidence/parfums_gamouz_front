/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0C0C0C',
          dark: '#141414',
          charcoal: '#1E1E1E',
          surface: '#262626',
          border: '#333333',
          gold: {
            DEFAULT: '#C5A880',
            light: '#E5D2BA',
            dark: '#9E7E52',
            metallic: '#D4AF37',
            accent: '#B89056',
          },
          cream: {
            DEFAULT: '#F9F8F6',
            light: '#FFFFFF',
            dark: '#F0ECE4',
            warm: '#EBE5DA',
          },
          muted: '#8E8881',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Didot', 'Georgia', 'serif'],
        sans: ['"Montserrat"', '"Inter"', 'system-ui', 'sans-serif'],
        arabic: ['"Cairo"', '"Tajawal"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.25em',
        widest: '0.2em',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.25)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
        'luxury-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

