import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";

export default [
  eslint.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-undef": "off", // TypeScriptのコンパイラがこれを処理するため
    },
  },
  {
    files: ["**/*.test.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        jest: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  prettierConfig,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];