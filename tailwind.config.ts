import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FCF9EE",
          100: "#F8F1D7",
          200: "#EFE0A8",
          300: "#E3CA74",
          400: "#D4AF37", // classic luxury gold
          500: "#B89326",
          600: "#98751B",
          700: "#755615",
          800: "#553D12",
          900: "#36260C",
        },
        navy: {
          850: "#0D1525",
          900: "#0B111E",
          950: "#060A12",
        },
        brand: {
          bkash: "#E2136E",
          nagad: "#F7941D",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
