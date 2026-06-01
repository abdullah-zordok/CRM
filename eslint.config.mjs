import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules/",
      "**/node_modules/",
      "dist/",
      "**/dist/",
      "build/",
      "**/build/",
      "coverage/",
      "**/coverage/",
      ".next/",
      "**/.next/",
      "playwright-report/",
      "**/playwright-report/",
      "test-results/",
      "**/test-results/",
      "*.min.js",
      "**/*.min.js",
      ".agents/",
      ".codex-run/",
      ".opencode/",
      ".specify/",
      "SpacKit/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        fetch: "readonly",
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        URL: "readonly",
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
];
