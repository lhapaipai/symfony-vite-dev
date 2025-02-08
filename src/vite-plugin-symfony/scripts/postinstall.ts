import { cp } from "fs/promises";
import { resolve } from "path";

const assetsDir = resolve(import.meta.dirname, "ux-assets");
const nodeModules = resolve(import.meta.dirname, "../node_modules");

await cp(assetsDir, nodeModules, { recursive: true });
