import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/", "node_modules/"],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.customize({
    semi: true,
    commaDangle: "always-multiline",
    quotes: "double",
  }),
);
