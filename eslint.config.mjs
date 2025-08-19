import {createConfig} from "@paratco/eslint-config";

export default createConfig({
  platform: "react",
  style: "stylistic",
  useImport: true,
  typescript: {
    tsconfigRootDir: "./",
    project: "./tsconfig.app.json",
  },
  overrides: [
    {
      rules: {
        "import-x/no-extraneous-dependencies": ["off"],
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "unicorn/no-array-reduce": "off"
      },
    },
  ],
  ignores: [
    "dist",
    "vite.config.ts",
    "eslint.config.mjs",
    "src/vite-env.d.ts",
    "lib/vite-env.d.ts",
  ],
});
