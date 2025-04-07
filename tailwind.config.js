/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: 'class', // Ajout de cette ligne pour activer le mode sombre via une classe
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Bleu personnalisé
        secondary: "#64748B", // Gris personnalisé
        accent: "#F59E0B", // Jaune personnalisé
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Police personnalisée
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};