import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";

export default defineConfig([
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },
]);
