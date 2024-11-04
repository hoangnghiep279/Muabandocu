/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        slab: ["Roboto Slab", "serif"],
        manrope: ["Manrope", "san-serif"],
        vietnam: ["Be Vietnam Pro", "san-serif"],
      },
      colors: {
        primaryColor: "#005D63",
        // secondColor: "#FFB800",
      },
    },
  },
  plugins: [],
};
