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
      },
    },
  },
  plugins: [],
} satisfies Config;
