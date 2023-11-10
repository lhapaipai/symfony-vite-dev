import { ComponentClass, FunctionComponent } from "react";

export type Component = string | FunctionComponent<object> | ComponentClass<object, any>;

declare global {
  function resolveReactComponent(name: string): ReactLazyModule;

  interface Window {
    resolveReactComponent(name: string): ReactLazyModule;
  }
}

export type ReactLazyModule = () => Promise<{
  default: Component;
}>;

export type ReactImportedModules = {
  [filePath: string]: ReactLazyModule;
};
