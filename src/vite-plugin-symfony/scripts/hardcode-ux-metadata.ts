import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const packageNames = [
  "ux-autocomplete",
  "ux-chartjs",
  "ux-cropperjs",
  "ux-dropzone",
  "ux-lazy-image",
  "ux-live-component",
  "ux-notify",
  "ux-react",
  "ux-svelte",
  "ux-swup",
  "ux-toggle-password",
  "ux-translator",
  "ux-turbo",
  "ux-typed",
  "ux-vue",
];

const playgroundDir = resolve(import.meta.dirname, "../../../playground");
const dstDir = resolve(import.meta.dirname, "ux-assets");

for (const packageName of packageNames) {
  const src = join(playgroundDir, "stimulus/vendor/symfony", packageName, "assets/package.json");
  const dst = join(dstDir, "@symfony", packageName, "package.json");
  await mkdir(dirname(dst), { recursive: true });

  await copyFile(src, dst);
}
