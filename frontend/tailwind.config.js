
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#6B46C1', // Example purple
        'brand-blue': '#3B82F6',   // Example blue
        'brand-yellow': '#F59E0B', // Example yellow
        'hero-gradient-from': '#8B5CF6', // Deeper purple for gradient
        'hero-gradient-to': '#3B82F6',   // Blue for gradient
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(to right bottom, var(--tw-gradient-stops))",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
