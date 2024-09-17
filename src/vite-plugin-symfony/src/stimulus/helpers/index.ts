import { Application, Context, Controller, ControllerConstructor } from "@hotwired/stimulus";
import thirdPartyControllers from "virtual:symfony/controllers";
import { getStimulusControllerId } from "~/stimulus/util";

declare module "@hotwired/stimulus" {
  interface Controller {
    __stimulusLazyController: boolean;
  }
}

export function createLazyController(dynamicImportFactory: LazyLoadedStimulusControllerModule, exportName = "default") {
  return class extends Controller {
    constructor(context: Context) {
      context.logDebugActivity = function (functionName) {
        this.application.logDebugActivity(this.identifier + "-lazywrapper", functionName);
      };
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
      dynamicImportFactory().then((controllerModule) => {
        this.application.register(this.identifier, controllerModule[exportName as "default"]);
      });
    }
  };
}

export function startStimulusApp() {
  const app = Application.start();

  app.debug = process.env.NODE_ENV === "development";

  for (const controllerInfos of thirdPartyControllers) {
    if (controllerInfos.fetch === "lazy") {
      app.register(controllerInfos.identifier, createLazyController(controllerInfos.controller));
    } else {
      app.register(controllerInfos.identifier, controllerInfos.controller);
    }
  }

  if (app.debug) {
    console.groupCollapsed("application #startStimulusApp and register controllers from controllers.json");
    console.log(
      "controllers",
      thirdPartyControllers.map((infos) => infos.identifier),
    );
    console.groupEnd();
  }

  return app;
}

type Module = StimulusControllerInfosImport | LazyLoadedStimulusControllerModule | ControllerConstructor;
type Modules = Record<string, Module>;

function isLazyLoadedControllerModule(
  unknownController: Module,
): unknownController is LazyLoadedStimulusControllerModule {
  if (typeof unknownController === "function") {
    return true;
  }
  return false;
}

function isStimulusControllerConstructor(unknownController: Module): unknownController is ControllerConstructor {
  if ((unknownController as ControllerConstructor).prototype instanceof Controller) {
    return true;
  }
  return false;
}

function isStimulusControllerInfosImport(
  unknownController: Module,
): unknownController is StimulusControllerInfosImport {
  if (
    typeof unknownController === "object" &&
    unknownController[Symbol.toStringTag] === "Module" &&
    unknownController.default
  ) {
    return true;
  }

  return false;
}

export function registerControllers(app: Application, modules: Modules) {
  const controllersAdded: string[] = [];

  if (app.debug) {
    console.groupCollapsed("application #registerControllers");
  }

  Object.entries(modules).forEach(([filePath, unknownController]) => {
    const identifier = getStimulusControllerId(filePath, "snakeCase");
    if (!identifier) {
      throw new Error(`Invalid filePath ${filePath}`);
    }
    if (isLazyLoadedControllerModule(unknownController)) {
      app.register(identifier, createLazyController(unknownController));
      controllersAdded.push(identifier);
    } else if (isStimulusControllerConstructor(unknownController)) {
      app.register(identifier, unknownController);
      controllersAdded.push(identifier);
    } else if (isStimulusControllerInfosImport(unknownController)) {
      registerController(app, unknownController.default);
      controllersAdded.push(unknownController.default.identifier);
    } else {
      throw new Error(
        `unknown Stimulus controller for ${identifier}. if you use import.meta.glob, don't forget to enable the eager option to true`,
      );
    }
  });

  if (app.debug) {
    console.groupEnd();
  }
}

export function registerController(app: Application, controllerInfos: StimulusControllerInfos) {
  if (!controllerInfos.enabled) {
    return;
  }
  if (controllerInfos.fetch === "lazy") {
    app.register(controllerInfos.identifier, createLazyController(controllerInfos.controller));
  } else {
    app.register(controllerInfos.identifier, controllerInfos.controller);
  }

  if (app.debug) {
    console.log(`application #registerController ${controllerInfos.identifier}`);
  }
}
