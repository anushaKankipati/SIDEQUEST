import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "theme-green": "var(--theme-green)",
        "theme-black": "var(--theme-black)",
        "light-hover-green": "var(--light-hover-green)",
      },
      screens: {
        tall: { raw: "(min-height: 770px)" },
        short: { raw: "(max-height: 769px)" },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
} satisfies Config;
