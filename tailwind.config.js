module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  theme: {
    extend: {
      colors: {
        'black': '#000000',
        'white': '#ffffff',
        'baby-blue': '#89CFF0',
        'dark-background': '#121212',
        'dark-text': '#e0e0e0',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      // Add more variants as needed
    },
  },
  plugins: [],
};