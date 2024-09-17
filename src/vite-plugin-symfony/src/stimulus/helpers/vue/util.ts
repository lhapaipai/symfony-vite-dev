import { defineAsyncComponent } from "vue";
import type { Component } from "vue";
import { ImportedModules } from "../types";
import { VueModule } from "./types";

const vueComponentsOrLoaders: {
  [key: string]: (() => Promise<VueModule>) | Component;
} = {};

export function registerVueControllerComponents(
  modules: ImportedModules<VueModule>,
  controllersDir = "./vue/controllers",
) {
  Object.entries(modules).forEach(([key, module]) => {
    if (typeof module !== "function") {
      vueComponentsOrLoaders[key] = module.default;
    } else {
      vueComponentsOrLoaders[key] = module;
    }
  });

  function loadComponent(name: string): Component {
    const componentPath = `${controllersDir}/${name}.vue`;

    if (!(componentPath in vueComponentsOrLoaders)) {
      const possibleValues = Object.keys(vueComponentsOrLoaders).map((key) =>
        key.replace("./", "").replace(".vue", ""),
      );

      throw new Error(`Vue controller "${name}" does not exist. Possible values: ${possibleValues.join(", ")}`);
    }

    if (typeof vueComponentsOrLoaders[componentPath] === "function") {
      const module = vueComponentsOrLoaders[componentPath] as () => Promise<VueModule>;
      vueComponentsOrLoaders[componentPath] = defineAsyncComponent(module);
    }

    return vueComponentsOrLoaders[componentPath];
  }

  window.resolveVueComponent = (name: string) => {
    return loadComponent(name);
  };
}
