import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{html,js,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "theme-green": "var(--theme-green)", 
        "theme-black": "text-gray-800",
        "light-hover-green": "var(--light-hover-green)",
      },
    },
  },
  plugins: [],
} satisfies Config;
