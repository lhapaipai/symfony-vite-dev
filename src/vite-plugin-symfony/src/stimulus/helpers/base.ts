import { Application, Controller } from "@hotwired/stimulus";
import thirdPartyControllers from "virtual:symfony/controllers";
import { getStimulusControllerFileInfos } from "./util";
import { ControllerImportedModules, LazyControllerModule } from "./types";

declare module "@hotwired/stimulus" {
  export class Controller {
    __stimulusLazyController: boolean;
  }
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

export function startStimulusApp(modules: ControllerImportedModules) {
  const app = Application.start();
  app.debug = true;

  Object.entries(modules).forEach(([filePath, controllerLoader]) => {
    const { identifier, lazy } = getStimulusControllerFileInfos(filePath);

    if (lazy) {
      app.register(identifier, getLazyController(controllerLoader));
    } else {
      controllerLoader().then((controllerConstructor) => {
        if (identifier && typeof controllerConstructor.default === "function") {
          app.register(identifier, controllerConstructor.default);
        }
      });
    }
  });

  for (const controllerName in thirdPartyControllers) {
    // eslint-disable-next-line no-prototype-builtins
    if (!thirdPartyControllers.hasOwnProperty(controllerName)) {
      continue;
    }
    app.register(controllerName, thirdPartyControllers[controllerName]);
  }

  return app;
}
