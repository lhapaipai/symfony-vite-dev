import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectDir = resolve(fileURLToPath(new URL(".", import.meta.url)));

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve(projectDir, "src"),
      "~tests": resolve(projectDir, "tests"),
    },
  },
});
