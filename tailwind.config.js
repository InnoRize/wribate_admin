/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: "#0A0066", // Add a custom primary color
        secondary: "#9333EA", // Add a custom secondary color
        accent: "#F97316", // Add an accent color
        neutral: "#64748B", // Add a neutral color
      },
      listStyleType: {
        disc: 'disc',
        decimal: 'decimal',
      },
    }
  },
  plugins: [
    scrollbarHide,
  ],
};
