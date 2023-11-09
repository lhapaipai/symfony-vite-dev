import { Application, type ControllerConstructor } from "@hotwired/stimulus";
import thirdPartyControllers from "virtual:symfony/controllers";
import { identifierFromFilePath } from "./util";

// console.log("from controllers", thirdPartyControllers);

type Module = {
  default: ControllerConstructor;
};

export type ImportedModules = {
  [filePath: string]: () => Promise<Module>;
};

export function startStimulusApp(modules: ImportedModules) {
  const app = Application.start();
  app.debug = true;

  Object.entries(modules).forEach(([filePath, controllerLoader]) => {
    const identifier = identifierFromFilePath(filePath);
    controllerLoader().then((controllerConstructor) => {
      if (identifier && typeof controllerConstructor.default === "function") {
        app.register(identifier, controllerConstructor.default);
      }
    });
  });

  console.log("load third party controllers", thirdPartyControllers);
  for (const controllerName in thirdPartyControllers) {
    // eslint-disable-next-line no-prototype-builtins
    if (!thirdPartyControllers.hasOwnProperty(controllerName)) {
      continue;
    }
    app.register(controllerName, thirdPartyControllers[controllerName]);
  }

  return app;
}
