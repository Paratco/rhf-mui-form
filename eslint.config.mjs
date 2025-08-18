import { createConfig } from "@paratco/eslint-config";

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
