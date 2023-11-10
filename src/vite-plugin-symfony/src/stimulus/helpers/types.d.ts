import { type ControllerConstructor } from "@hotwired/stimulus";

export type ControllerModule = {
  default: ControllerConstructor;
};

export type LazyControllerModule = () => Promise<ControllerModule>;

export type ControllerImportedModules = {
  [filePath: string]: LazyControllerModule;
};
