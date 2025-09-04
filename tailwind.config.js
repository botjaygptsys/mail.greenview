/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './App.tsx',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F3F2EC',
        primary: '#7E8A70',
        accent: '#C0A06D',
        subtle: '#EAE9E4',
        charcoal: '#3D403A',
        'charcoal-light': '#4A4E47'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif']
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 1s ease-in-out'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
