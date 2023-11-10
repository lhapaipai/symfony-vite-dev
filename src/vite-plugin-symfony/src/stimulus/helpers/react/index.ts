import { ReactImportedModules, ReactLazyModule } from "./react";

export function registerReactControllerComponents(
  modules: ReactImportedModules,
  controllersDir = "./react/controllers",
) {
  const reactImportedModules = modules;

  window.resolveReactComponent = (name: string): ReactLazyModule => {
    const reactModule = reactImportedModules[`${controllersDir}/${name}.jsx` || `${controllersDir}/${name}.tsx`];
    if (typeof reactModule === "undefined") {
      const possibleValues = Object.keys(reactImportedModules).map((key) =>
        key.replace(`${controllersDir}/`, "").replace(".jsx", "").replace(".tsx", ""),
      );
      throw new Error(`React controller "${name}" does not exist. Possible values: ${possibleValues.join(", ")}`);
    }

    return reactModule;
  };
}
