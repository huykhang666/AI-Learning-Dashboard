/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dashboard-blue': '#1E6BFF',
        'dashboard-bg': '#F0F7FF',
      },
    },
  },
  plugins: [],
}