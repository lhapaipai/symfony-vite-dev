import { SvelteImportedModules, SvelteLazyModule } from "./svelte";

export function registerSvelteControllerComponents(
  modules: SvelteImportedModules,
  controllersDir = "./svelte/controllers",
) {
  const svelteImportedModules = modules;
  console.log("modules", modules);
  window.resolveSvelteComponent = (name: string): SvelteLazyModule => {
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
