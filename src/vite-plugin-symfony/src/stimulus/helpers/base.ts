import { Application, Controller } from "@hotwired/stimulus";
import thirdPartyControllers from "virtual:symfony/controllers";
import { getStimulusControllerFileInfos } from "~/stimulus/util";
import { ControllerModule, ImportedModules, LazyModule } from "./types";

declare module "@hotwired/stimulus" {
  interface Controller {
    __stimulusLazyController: boolean;
  }
}

export function getLazyController(lazyControllerModule: LazyModule<ControllerModule>, exportName = "default") {
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

export function startStimulusApp() {
  const app = Application.start();

  app.debug = process.env.NODE_ENV === "development";

  for (const controllerName in thirdPartyControllers) {
    // eslint-disable-next-line no-prototype-builtins
    if (!thirdPartyControllers.hasOwnProperty(controllerName)) {
      continue;
    }
    app.register(controllerName, thirdPartyControllers[controllerName]);
  }

  return app;
}

export function registerControllers(app: Application, modules: ImportedModules<ControllerModule>) {
  Object.entries(modules).forEach(([filePath, importedModule]) => {
    const { identifier, lazy } = getStimulusControllerFileInfos(filePath);
    if (!identifier) {
      throw new Error(`Invalid filePath name ${filePath}`);
    }
    if (typeof importedModule === "function") {
      if (lazy) {
        app.register(identifier, getLazyController(importedModule));
      } else {
        importedModule().then((controllerConstructor) => {
          if (identifier && typeof controllerConstructor.default === "function") {
            app.register(identifier, controllerConstructor.default);
          }
        });
      }
    } else {
      app.register(identifier, importedModule.default);
    }
  });
}
