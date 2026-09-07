/* global module */
/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@big-calendar/(.*)$": "<rootDir>/src/$1",
  },
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
};
