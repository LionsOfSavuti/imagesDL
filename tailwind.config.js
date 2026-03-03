/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        warning: '#ef4444',
        alert: '#f59e0b',
        success: '#10b981'
      }
    }
  },
  plugins: []
}
