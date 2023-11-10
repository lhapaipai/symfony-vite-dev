import type { SvelteComponent } from "svelte";

declare global {
  function resolveSvelteComponent(name: string): SvelteLazyModule;

  interface Window {
    resolveSvelteComponent(name: string): SvelteLazyModule;
  }
}

export type SvelteLazyModule = () => Promise<{
  default: typeof SvelteComponent<any>;
}>;

export type SvelteImportedModules = {
  [filePath: string]: SvelteLazyModule;
};
