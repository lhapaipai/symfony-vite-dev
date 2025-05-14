import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/stimulus/helpers/index.ts",
    "src/stimulus/helpers/vue/index.ts",
    "src/stimulus/helpers/react/index.ts",
    "src/stimulus/helpers/svelte/index.ts",
    "src/stimulus/helpers/svelte4/index.ts",
    "src/stimulus/helpers/react/render_controller.ts",
    "src/stimulus/helpers/svelte/render_controller.ts",
    "src/stimulus/helpers/svelte4/render_controller.ts",
  ],
  dts: true,
  format: ["esm", "cjs"],
  esbuildOptions(options) {
    options.external = [
      "picocolors",
      "fast-glob",
      "@hotwired/stimulus",
      "virtual:symfony/controllers",
      "vue",
      "react",
      "react-dom/client",
      "svelte",
    ];
  },
  shims: true,
  clean: true,
  splitting: false,
});
