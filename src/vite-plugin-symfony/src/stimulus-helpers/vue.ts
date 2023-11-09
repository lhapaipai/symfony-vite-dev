import { defineAsyncComponent } from "vue";
import type { Component } from "vue";

declare global {
  function resolveVueComponent(name: string): Component;

  interface Window {
    resolveVueComponent(name: string): Component;
  }
}

export type VueImportedModules = {
  [filePath: string]: () => Promise<Component>;
};

export function registerVueControllerComponents(modules: VueImportedModules, controllersDir = "./vue/controllers") {
  const vueControllers = Object.keys(modules).reduce((acc, key) => {
    acc[key] = undefined;
    return acc;
  }, {} as Record<string, object | undefined>);

  function loadComponent(name: string) {
    const componentPath = `${controllersDir}/${name}.vue`;

    if (!(componentPath in vueControllers)) {
      const possibleValues = Object.keys(vueControllers).map((key) => key.replace("./", "").replace(".vue", ""));

      throw new Error(`Vue controller "${name}" does not exist. Possible values: ${possibleValues.join(", ")}`);
    }

    if (typeof vueControllers[componentPath] === "undefined") {
      vueControllers[componentPath] = defineAsyncComponent(modules[componentPath]);
    }

    return vueControllers[componentPath] as object;
  }

  window.resolveVueComponent = (name: string): object => {
    return loadComponent(name);
  };
}
