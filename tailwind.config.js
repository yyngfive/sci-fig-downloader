/** @type {import('tailwindcss').Config} */
export default {
  content: ["assets/**", "entrypoints/**", "components/**"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"),require('@tailwindcss/typography'),],
  daisyui: {
    themes: ["lemonade"],
  },
};
