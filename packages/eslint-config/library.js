import { resolve } from "node:path";

const project = resolve(process.cwd(), "tsconfig.json");

export default {
  extends: ["eslint:recommended", "prettier", "turbo", "simple-import-sort"],
  plugins: ["only-warn"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [".*.js", "node_modules/", "dist/"],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
};
