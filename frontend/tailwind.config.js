/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        openSans: ["Open Sans", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
      },
      colors: {
        'night-blue': '#2d545e',
        'night-blue-shadow': '#12343b',
        'sand-tan': '#e1b382',
        'sand-tan-shadow': '#c89666',
      },
    },
  },
  plugins: [],
};
