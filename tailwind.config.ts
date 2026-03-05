import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C87A',
          dark: '#9A7A32',
          50: '#FBF7EC',
          100: '#F5ECCD',
          200: '#EDDB9E',
          300: '#E8C87A',
          400: '#D4B45E',
          500: '#C9A84C',
          600: '#9A7A32',
          700: '#6B5623',
          800: '#3D3114',
          900: '#1E1809',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          50: '#1A1A1A',
          100: '#141414',
          200: '#1E1E1E',
          300: '#242424',
          400: '#2A2A2A',
          500: '#0F0F0F',
          600: '#0A0A0A',
          700: '#050505',
          800: '#030303',
          900: '#000000',
        },
        cream: '#F5F0E8',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'gold-border': 'goldBorder 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'halo': 'halo 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        goldBorder: {
          '0%, 100%': { borderColor: '#C9A84C' },
          '50%': { borderColor: '#E8C87A' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        halo: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 168, 76, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C, #E8C87A, #C9A84C)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0A, #141414)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.1), transparent)',
      },
    },
  },
  plugins: [],
};

export default config;
