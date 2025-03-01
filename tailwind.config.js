/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode if you want to use it
  darkMode: 'media', // or 'class' for class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // For App Router (if using)
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here if needed
      },
      fontFamily: {
        sans: ['var(--font-sans)'], 
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}