import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  target: "es2022",
  clean: true,
  loader: {
    ".json": "json",
  },
});
