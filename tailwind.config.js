/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D5016",
        secondary: "#8B6914",
        accent: "#E67E22",
        surface: "#F5F3EF",
        background: "#FAFAF8",
        success: "#27AE60",
        warning: "#F39C12",
        error: "#C0392B",
        info: "#3498DB"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};