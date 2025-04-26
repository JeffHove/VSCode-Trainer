import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import tailwind from "eslint-plugin-readable-tailwind";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Formatting
  perfectionist.configs["recommended-alphabetical"],
  {
    plugins: {
      "@stylistic": stylistic,
      "readable-tailwind": tailwind
    }
  },

  // Linting
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],

  {
    files: ["**/*.svelte"],
    languageOptions:
    {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { parser: ts.parser },
    },
  },
  { ignores: ["build/", ".svelte-kit/", "helloWorld.js"] },
  {
    rules: {
      ...tailwind.configs.error.rules,
      "@stylistic/max-statements-per-line": ["error", { max: 3 }],
      "@stylistic/member-delimiter-style": ["error", {}], // {} overrides recommended-flat config with default.
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@typescript-eslint/no-unused-expressions": ["error", { allowTernary: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-restricted-syntax": ["error",
        {
          message: "FunctionExpression: Arrow functions preferred",
          selector: "FunctionExpression[generator=false]:not(:has(ThisExpression)):not(Property[kind='get'] > .value):not(Property[kind='set'] > .value)",
        },
        {
          message: "FunctionDeclaration: Arrow functions preferred",
          selector: "FunctionDeclaration[generator=false]:not(:has(ThisExpression)):not(MethodDefinition[kind='get'] > .value):not(MethodDefinition[kind='set'] > .value)",
        },
      ],
      "readable-tailwind/multiline": ["error", { preferSingleLine: true, printWidth: 999 }],
    },
  },
];
