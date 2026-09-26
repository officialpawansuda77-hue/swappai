/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#F7F5F0',
          text: '#111111',
          secondary: '#6B6B67',
          accent: '#FF5A00',
          dark: '#11100E',
          border: 'rgba(17,17,17,0.10)',
        }
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      letterSpacing: {
        'ultrawide': '0.2em',
        'widest2': '0.15em',
      },
      fontSize: {
        'hero': ['clamp(56px,8vw,110px)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '800' }],
        'section': ['clamp(40px,6vw,80px)', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '700' }],
        'eyebrow': ['11px', { lineHeight: '1.2', letterSpacing: '0.15em', fontWeight: '600' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
