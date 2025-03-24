import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    ignores: ["test/*"]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "_", argsIgnorePattern: "_" }]
    }
  },
];