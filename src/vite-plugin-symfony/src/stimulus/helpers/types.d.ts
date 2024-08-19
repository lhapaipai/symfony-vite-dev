import type { ComponentClass, FunctionComponent } from "react";
import { Component as VueComponent } from "vue";
import type { SvelteComponent } from "svelte";

export type LazyModule<M> = () => Promise<M>;
export type ImportedModule<M> = M | LazyModule<M>;
export type ImportedModules<M> = Record<string, ImportedModule<M>>;

export type ReactComponent = string | FunctionComponent<object> | ComponentClass<object, any>;
export type ReactModule = {
  default: ReactComponent;
};

export type VueModule = {
  default: VueComponent;
};

export type SvelteModule = {
  default: SvelteComponent;
};

declare global {
  function resolveReactComponent(name: string): ImportedModule<ReactModule>;
  function resolveVueComponent(name: string): VueComponent;
  function resolveSvelteComponent(name: string): ImportedModule<SvelteModule>;

  interface Window {
    resolveReactComponent(name: string): ImportedModule<ReactModule>;
    resolveVueComponent(name: string): VueComponent;
    resolveSvelteComponent(name: string): ImportedModule<SvelteModule>;
  }
}
