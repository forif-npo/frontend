// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "auto",
  proseWrap: "preserve",
  htmlWhitespaceSensitivity: "css",
  jsxSingleQuote: false,
  bracketSameLine: false,
  plugins: ["prettier-plugin-tailwindcss"],
};

module.exports = config;
