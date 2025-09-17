/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // 👈 escanea tus templates Angular
  ],
  theme: {
    extend: {
      fontFamily: {
        artistic: ['"Dancing Script"', 'cursive'], // nombre personalizado
        ubuntu: ["Ubuntu", "sans-serif"],
      },
    },
  },
  plugins: [],
}
