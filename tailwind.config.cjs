/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'octo-bg': '#1B005A',
        'octo-pink': '#FD38C0',
        'octo-violet': '#6A2AFF',
        'octo-aqua': '#00E0FF',
        'octo-gray': '#F5F5F5',
      },
      fontFamily: {
        nunito: ["'Nunito'", 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
