import { Controller } from "@hotwired/stimulus";
import { LazyControllerModule } from "./types";

declare module "@hotwired/stimulus" {
  export class Controller {
    __stimulusLazyController: boolean;
  }
}

export const CONTROLLER_FILENAME_REGEX = /^(?:.*?(?:controllers)\/|\.?\.\/)?(.+)(?:[/_-](lazy)?controller\.[jt]sx?)$/;

export function getStimulusControllerFileInfos(key: string): StimulusControllerFileInfos {
  const [, identifier, lazy] = key.match(CONTROLLER_FILENAME_REGEX) || [];

  return {
    identifier: identifier ? identifier.replace(/_/g, "-").replace(/\//g, "--") : undefined,
    lazy: lazy === "lazy",
  };
}

// Normalize the controller name: remove the initial @ and use Stimulus format
export function generateStimulusId(packageName: string) {
  if (packageName.startsWith("@")) {
    packageName = packageName.substring(1);
  }
  return packageName.replace(/_/g, "-").replace(/\//g, "--");
}

export function getLazyController(lazyControllerModule: LazyControllerModule, exportName = "default") {
  return class extends Controller {
    constructor(context) {
      super(context);
      this.__stimulusLazyController = true;
    }
    initialize() {
      if (
        this.application.controllers.find((controller) => {
          return controller.identifier === this.identifier && controller.__stimulusLazyController;
        })
      ) {
        return;
      }
      lazyControllerModule().then((controller) => {
        this.application.register(this.identifier, controller[exportName]);
      });
    }
  };
}
