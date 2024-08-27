/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        // Define custom screen sizes
        screens: {
          'xs': '480px',  // Extra small devices
          'sm': '640px',  // Small devices (default)
          'md': '768px',  // Medium devices (default)
          'lg': '1024px', // Large devices (default)
          'xl': '1280px', // Extra large devices (default)
          '2xl': '1536px', // 2X large devices (default)
          '3xl': '1920px', // Custom screen size for very large devices
        },
  
        // Define custom fonts
        fontFamily: {
          sans: ['Lato', 'sans-serif'],   // Using Lato as the sans-serif font
        },
  
        // Define light and dark mode colors
        colors: {
          // Light mode colors
          light: {
            background: '#ffffff',  // Light background color
            text: '#333333',        // Light text color
            primary: '#1a73e8',     // Light primary color
            secondary: '#ff5722',   // Light secondary color
          },
          // Dark mode colors
          dark: {
            background: '#121212',  // Dark background color
            text: '#ffffff',        // Dark text color
            primary: '#bb86fc',     // Dark primary color
            secondary: '#03dac6',   // Dark secondary color
          },
        },
      },
    },
  
    // Enable dark mode with class strategy
    darkMode: 'class', // Use 'media' or 'class' to toggle dark mode
    plugins: [],
  }
  