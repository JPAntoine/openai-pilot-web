/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme");
import DTEColors from './src/assets/colors/DTEColors';

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
        'custom': '0px 4px 4px 0px #00000040',
      },
      transitionProperty: {
        "max-height": "max-height",
      },

      colors: {
        background: "#F4F5F7", //main background color
        "footer-tertiary": "#66717F",
        primary: "#1F57A5",
        "text-primary": "#202427",
        secondary: "#E5F5F8",
        "text-link": "#0000EE",
        "accent-1": "#639DDF", //mostly used as background for chat history and chat input
        ...DTEColors,
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