import { ImportedModule, ImportedModules } from "../types";
import { SvelteModule } from "./types";

let svelteImportedModules: ImportedModules<SvelteModule> = {};

export function registerSvelteControllerComponents(
  modules: ImportedModules<SvelteModule>,
  controllersDir = "./svelte/controllers",
) {
  svelteImportedModules = { ...svelteImportedModules, ...modules };

  window.resolveSvelteComponent = (name: string): ImportedModule<SvelteModule> => {
    const svelteModule = svelteImportedModules[`${controllersDir}/${name}.svelte`];
    if (typeof svelteModule === "undefined") {
      const possibleValues = Object.keys(svelteImportedModules).map((key) =>
        key.replace(`${controllersDir}/`, "").replace(".svelte", ""),
      );
      throw new Error(`Svelte controller "${name}" does not exist. Possible values: ${possibleValues.join(", ")}`);
    }

    return svelteModule;
  };
}
