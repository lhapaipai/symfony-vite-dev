export type LazyModule<M> = () => Promise<M>;
export type ImportedModule<M> = M | LazyModule<M>;
export type ImportedModules<M> = Record<string, ImportedModule<M>>;

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
