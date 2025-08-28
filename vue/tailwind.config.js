/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2563eb',
        'primary-dark': '#1e40af',
        'accent-light': '#eff6ff',
        'border-black': '#000000',
        'text-dark': '#1f2937',
        'question-bg': '#eff6ff',
        'answer-bg': '#1e40af',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

