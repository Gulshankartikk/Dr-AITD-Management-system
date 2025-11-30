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
        // New Palette
        'navy': '#1E293B',
        'sky-blue': '#0EA5E9',
        'soft-grey': '#CBD5E1',
        'background': '#F1F5F9',
        'text-grey': '#475569',
      },
    },
  },
  plugins: [],
};
