import { Application } from "@hotwired/stimulus";
import thirdPartyControllers from "virtual:symfony/controllers";

console.log("from controllers", thirdPartyControllers);

type Module = {
  [x: string]: unknown;
};

export type ImportedModules = {
  [filePath: string]: () => Promise<Module>;
};

export const CONTROLLER_FILENAME_REGEX = /^(?:.*?(?:controllers)\/|\.?\.\/)?(.+)(?:[/_-]controller\.[jt]sx?)$/;

export function identifierFromFilePath(key: string): string | undefined {
  const extract = (key.match(CONTROLLER_FILENAME_REGEX) || [])[1];
  if (extract) return extract.replace(/_/g, "-").replace(/\//g, "--");
}

export function registerStimulusControllers(app, thirdPartyControllers, modules: ImportedModules) {
  Object.entries(modules).forEach(([filePath, controllerLoader]) => {
    const identifier = identifierFromFilePath(filePath);
    controllerLoader().then((controllerConstructor) => {
      if (identifier && typeof controllerConstructor.default === "function") {
        app.register(identifier, controllerConstructor.default);
      }
    });
  });
  console.log("third party controllers", thirdPartyControllers);
  setTimeout(() => {
    for (const controllerName in thirdPartyControllers) {
      // eslint-disable-next-line no-prototype-builtins
      if (!thirdPartyControllers.hasOwnProperty(controllerName)) {
        continue;
      }
      app.register(controllerName, thirdPartyControllers[controllerName]);
    }
    // app.load(thirdPartyControllers);
    // thirdPartyControllers.forEach(({ identifier, controllerLoader }) => {
    //   controllerLoader().then((controllerConstructor) => {
    //     app.register(identifier, controllerConstructor.default);
    //   });
    // });
  }, 3000);
}

export function startStimulusApp(modules: ImportedModules) {
  const app = Application.start();
  app.debug = true;

  Object.entries(modules).forEach(([filePath, controllerLoader]) => {
    const identifier = identifierFromFilePath(filePath);
    controllerLoader().then((controllerConstructor) => {
      if (identifier && typeof controllerConstructor.default === "function") {
        // @ts-ignore
        app.register(identifier, controllerConstructor.default);
      }
    });
  });

  console.log("third party controllers", thirdPartyControllers);
  setTimeout(() => {
    for (const controllerName in thirdPartyControllers) {
      // eslint-disable-next-line no-prototype-builtins
      if (!thirdPartyControllers.hasOwnProperty(controllerName)) {
        continue;
      }
      // @ts-ignore
      app.register(controllerName, thirdPartyControllers[controllerName]);
    }
    // app.load(thirdPartyControllers);
    // thirdPartyControllers.forEach(({ identifier, controllerLoader }) => {
    //   controllerLoader().then((controllerConstructor) => {
    //     app.register(identifier, controllerConstructor.default);
    //   });
    // });
  }, 3000);

  return app;
}
