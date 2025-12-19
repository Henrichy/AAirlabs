module.exports = {
  root: true,
  env: { es2021: true, node: true },
  parserOptions: { ecmaVersion: 2021, sourceType: "module" },
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"]
    }
  ]
};
