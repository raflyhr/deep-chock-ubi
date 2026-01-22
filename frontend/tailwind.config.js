/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: "#fdf5f3",
          100: "#fbe8e2",
          200: "#f7d1c5",
          300: "#f0ac98",
          400: "#e47d63",
          500: "#d55d43", // Primary
          600: "#c24830",
          700: "#a23a26",
          800: "#863324",
          900: "#702f24",
        },
        cream: {
          50: "#fdfcfa",
          100: "#faf7f0",
          200: "#f5ede0",
          300: "#ebe0c8",
          400: "#dcc9a3",
          500: "#c9ad7f",
          600: "#b8955f",
          700: "#9b7a4a",
          800: "#7d6340",
          900: "#675237",
        },
        deepbrown: {
          50: "#f6f5f4",
          100: "#e7e5e2",
          200: "#d0cbc5",
          300: "#b2aa9f",
          400: "#958a7c",
          500: "#7c7064",
          600: "#5d534a",
          700: "#4a433c",
          800: "#3e3934",
          900: "#2d2822", // Dark background
        },
        border: "#d0cbc5",
        input: "#d0cbc5",
        ring: "#d55d43",
        background: "#ffffff",
        foreground: "#2d2822",
      },
      fontFamily: {
        sans: ["Inter", "Outfit", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
