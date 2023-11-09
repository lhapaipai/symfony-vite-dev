import { type ControllerConstructor } from "@hotwired/stimulus";

type ControllerModule = {
  default: ControllerConstructor;
};

export type ControllerImportedModules = {
  [filePath: string]: () => Promise<ControllerModule>;
};
