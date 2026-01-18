/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aqui adicionamos as cores da imagem que você gostou
        darkBg: '#020617',
        goldAccent: '#eab308',
      }
    },
  },
  plugins: [],
}