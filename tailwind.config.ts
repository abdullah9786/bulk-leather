import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Sand Theme (Default)
        luxurySand: {
          bg: "#FAF8F5",
          secondary: "#EFE7DD",
          text: "#3A2D28",
          body: "#6C5F57",
          accent: "#D6A76C",
          accentHover: "#C89654",
          card: "#FFFFFF",
        },
        // Dark Elegance Theme
        darkElegance: {
          bg: "#1A1816",
          secondary: "#2C2824",
          text: "#F5F1EA",
          body: "#D4CFC6",
          accent: "#D6A76C",
          accentHover: "#E8BC7E",
          card: "#252220",
        },
        // Warm Earthy Theme
        warmEarth: {
          bg: "#2C1810",
          secondary: "#3E2415",
          text: "#F2E8DC",
          body: "#C9B8A6",
          accent: "#D6A76C",
          accentHover: "#E8BC7E",
          card: "#362318",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.8s ease-out",
        "slide-in-right": "slideInRight 0.8s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-50px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(50px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

