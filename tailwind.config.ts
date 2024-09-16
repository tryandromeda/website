import { type Config } from "tailwindcss";
import Typography from "tailwindcss/typography"

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        holy: ["holy", "sans-serif"],
      },
    },
  },
  plugins: [
    Typography
  ]
} satisfies Config;
