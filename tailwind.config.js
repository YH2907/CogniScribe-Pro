// tailwind.config.js
module.exports = {
  darkMode: 'class', // This MUST be set to 'class'
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // We use these names in our components to ensure they swap automatically
        app: {
          bg: 'var(--bg)',
          card: 'var(--surface)',
          text: 'var(--text)',
          border: 'var(--border)',
        }
      }
    },
  },
  plugins: [],
};