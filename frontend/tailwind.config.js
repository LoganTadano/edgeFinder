/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080c14",
        surface: "#0d1421",
        "surface-alt": "#0a1018",
        lime: "#b3ff00",
        crimson: "#ff3b4e",
        ice: "#4fc3f7",
        "chart-orange": "#ff9500",
      },
      fontFamily: {
        barlow: ["Barlow Condensed", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
