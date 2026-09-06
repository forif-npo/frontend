/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
        },
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@core/(.*)$": "<rootDir>/../../packages/core/src/$1",
    "^@ui/(.*)$": "<rootDir>/../../packages/ui/src/$1",
  },
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.test.[tj]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
};
