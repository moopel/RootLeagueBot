import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";

export default tseslint.config(
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    ...unicorn.configs.recommended,
    files: ["src/**/*.ts"],
    languageOptions: {
      ...unicorn.configs.recommended.languageOptions,
      parser: tseslint.parser,
    },
    rules: {
      ...unicorn.configs.recommended.rules,
      "unicorn/filename-case": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/single-line-block-comment-style": "off",
    },
  },
);
