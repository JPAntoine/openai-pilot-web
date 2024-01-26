/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      ...defaultTheme.fontSize,
      lg: ["17px", "20px"],
    },
    extend: {
      boxShadow: {
        sce: "0px 0px 15px 4px rgba(133,133,133,0.5)",
      },
      transitionProperty: {
        "max-height": "max-height",
      },

      colors: {
        "sce-off-white": "#F1F1F1",
        "sce-grey": {
          100: "#D5D5D5",
          200: "#D2D2D2",
          300: "#515C67",
          500: "#707372",
          700: "#101820",
          800: "#2D343B",
        },
        "sce-amber": {
          400: "#FED141",
        },
        "edison-green": "#00664F",
      },
      gap: {
        9.5: "2.375rem",
      },
      width: {
        pdf: 700,
      },
      aspectRatio: {
        page: "8.5 / 11",
      },
      fontFamily: {
        sans: '"Helvetica", Arial, sans-serif',
        sf: "system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif",
        "open-sans": '"Open Sans", sans-serif',
        code: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospaced',
      },
      fontSize: {
        med: "15px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
