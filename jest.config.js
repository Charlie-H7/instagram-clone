const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node", // For like backend tests (uncomment for whichever)
  // testEnvironment: "jsdom", // For react component test
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/$1",
},
};