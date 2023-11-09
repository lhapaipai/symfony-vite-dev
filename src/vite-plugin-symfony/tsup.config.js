import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/stimulus-helpers/index.ts"],
  dts: true,
  format: ["esm", "cjs"],
  esbuildOptions(options) {
    options.external = ["picocolors", "fast-glob", "@hotwired/stimulus", "virtual:symfony/controllers", "vue"];
  },
  shims: true,
});
