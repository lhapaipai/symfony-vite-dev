import { Application } from "@hotwired/stimulus";
import thirdPartyControllers from "virtual:symfony/controllers";
import { getLazyController, getStimulusControllerFileInfos } from "./util";
import { ControllerImportedModules } from "./types";

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
