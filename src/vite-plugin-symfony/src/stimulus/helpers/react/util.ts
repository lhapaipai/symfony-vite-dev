import { ImportedModule, ImportedModules } from "../types";
import { ReactModule } from "./types";

let reactImportedModules: ImportedModules<ReactModule> = {};

export function registerReactControllerComponents(
  modules: ImportedModules<ReactModule>,
  controllersDir = "./react/controllers",
) {
  reactImportedModules = { ...reactImportedModules, ...modules };

  window.resolveReactComponent = (name: string): ImportedModule<ReactModule> => {
    const reactModule =
      reactImportedModules[`${controllersDir}/${name}.jsx`] || reactImportedModules[`${controllersDir}/${name}.tsx`];
    if (typeof reactModule === "undefined") {
      const possibleValues = Object.keys(reactImportedModules).map((key) =>
        key.replace(`${controllersDir}/`, "").replace(".jsx", "").replace(".tsx", ""),
      );
      throw new Error(`React controller "${name}" does not exist. Possible values: ${possibleValues.join(", ")}`);
    }

    return reactModule;
  };
}
