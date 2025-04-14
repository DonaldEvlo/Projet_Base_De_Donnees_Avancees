/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#64748B",
        accent: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      animation: {
        'splash-entry': 'splashEntry 2s ease-out forwards',
        'loading-bar': 'loadbar 2.5s ease-in-out forwards',
        'fade-in': 'fadeIn 1.5s ease-out',
        'fade-slide-in': 'fadeSlideIn 1s ease-out',
        'pop-in': 'popIn 0.6s ease-out',
      },
      splashEntry: {
        '0%': { opacity: 0, transform: 'scale(0.8) translateY(20px)' },
        '50%': { opacity: 1, transform: 'scale(1.05) translateY(0)' },
        '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
      },
      keyframes: {
        loadbar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        glow: '0 0 10px rgba(99, 102, 241, 0.6)', // pour un petit effet lumineux bleu/violet
      },
    },
  },
  plugins: [],
};
