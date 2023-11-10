import { generateStimulusId } from "./helpers/util";
import { createRequire } from "node:module";

type ControllerUserConfig = {
  enabled?: boolean;
  fetch?: "eager" | "lazy";
  name?: string;
  autoimport?: {
    [path: string]: boolean;
  };
  main?: string;
};

type ControllersConfig = {
  controllers: {
    [packageName: string]: {
      [controllerName: string]: ControllerUserConfig;
    };
  };
  entrypoints: {
    [key: string]: string;
  };
};

export const virtualSymfonyControllersModuleId = "virtual:symfony/controllers";
export const resolvedVirtualSymfonyControllersModuleId = "\0" + virtualSymfonyControllersModuleId;

export function createControllersModule(config: ControllersConfig) {
  const require = createRequire(import.meta.url);
  const controllerContents = [];
  let importStatementContents = "";
  let hasLazyControllers = false;
  let controllerIndex = 0;

  if ("undefined" === typeof config["controllers"]) {
    throw new Error('Your Stimulus configuration file (assets/controllers.json) lacks a "controllers" key.');
  }

  for (const packageName in config.controllers) {
    let packageConfig = null;

    try {
      // https://nodejs.org/api/esm.html#import-attributes
      // TODO : change to this when stable
      // packageConfig = (await import(`${packageName}/package.json`, { assert: { type: "json" } })).default;
      packageConfig = require(`${packageName}/package.json`);
    } catch (e) {
      console.log(`The file "${packageName}/package.json" could not be found. Try running "npm install --force".`);
    }

    // package can define multiple stimulus controllers
    // used only by @symfony/ux-turbo : turbo-core, mercure-turbo-stream
    for (const controllerName in config.controllers[packageName]) {
      const controllerReference = `${packageName}/${controllerName}`;

      if (
        packageConfig.symfony &&
        packageConfig &&
        "undefined" === typeof packageConfig.symfony.controllers[controllerName]
      ) {
        throw new Error(`Controller "${controllerReference}" does not exist in the package and cannot be compiled.`);
      }

      const controllerPackageConfig = packageConfig.symfony?.controllers[controllerName] || {};
      const controllerUserConfig = config.controllers[packageName][controllerName];

      if (!controllerUserConfig.enabled) {
        continue;
      }

      /**
       * sometimes default export of the package is not the controller entrypoint.
       * used by : @symfony/ux-react, @symfony/ux-vue, @symfony/ux-svelte, @symfony/ux-turbo
       *
       * ex: @symfony/ux-react (extract package.json)
       *
       * {
       *   "module": "dist/register_controller.js",
       *   "type": "module",
       *   "symfony": {
       *       "controllers": {
       *           "react": {
       *               "main": "dist/render_controller.js",
       *               "fetch": "eager",
       *               "enabled": true
       *           }
       *       },
       *   }
       * }
       */
      let controllerMain = packageName;
      if (controllerPackageConfig.main) {
        controllerMain = `${packageName}/${controllerPackageConfig.main}`;
      }
      if (controllerUserConfig.main) {
        controllerMain = `${packageName}/${controllerPackageConfig.main}`;
      }

      const fetchMode = controllerUserConfig.fetch || "eager";

      let moduleValueContents = ``;

      if (fetchMode === "eager") {
        // controller & dependencies are included in the JavaScript that's
        // downloaded when the page is loaded
        const controllerNameForVariable = `controller_${controllerIndex++}`;
        importStatementContents += `import ${controllerNameForVariable} from '${controllerMain}';\n`;

        moduleValueContents = controllerNameForVariable;
      } else if (fetchMode === "lazy") {
        // controller & dependencies are isolated into a separate file and only
        // downloaded asynchronously if (and when) the data-controller HTML appears
        // on the page.
        hasLazyControllers = true;
        moduleValueContents = generateLazyController(controllerMain, 2);
      } else {
        throw new Error(`Invalid fetch mode "${fetchMode}" in controllers.json. Expected "eager" or "lazy".`);
      }

      let controllerNormalizedName = generateStimulusId(controllerReference);

      // allow the package or user config to override name
      // used by ux-live-component
      if ("undefined" !== typeof controllerPackageConfig.name) {
        controllerNormalizedName = controllerPackageConfig.name.replace(/\//g, "--");
      }
      if ("undefined" !== typeof controllerUserConfig.name) {
        controllerNormalizedName = controllerUserConfig.name.replace(/\//g, "--");
      }

      controllerContents.push(`'${controllerNormalizedName}': ${moduleValueContents}`);

      for (const autoimport in controllerUserConfig.autoimport || []) {
        if (controllerUserConfig.autoimport[autoimport]) {
          importStatementContents += "import '" + autoimport + "';\n";
        }
      }
    }
  }

  if (hasLazyControllers) {
    importStatementContents = `import { Controller } from '@hotwired/stimulus';\n` + importStatementContents;
  }

  const moduleContent = `${importStatementContents}\nexport default {\n${controllerContents.join(",\n")}\n};\n`;
  // console.log(moduleContent);
  return moduleContent;
}

export function generateLazyController(controllerPath: string, indentationSpaces: number, exportName = "default") {
  const spaces = " ".repeat(indentationSpaces);

  return `class extends Controller {
${spaces}    constructor(context) {
${spaces}        super(context);
${spaces}        this.__stimulusLazyController = true;
${spaces}    }
${spaces}    initialize() {
${spaces}        if (this.application.controllers.find((controller) => {
${spaces}            return controller.identifier === this.identifier && controller.__stimulusLazyController;
${spaces}        })) {
${spaces}            return;
${spaces}        }
${spaces}        import('${controllerPath.replace(/\\/g, "\\\\")}').then((controller) => {
${spaces}            this.application.register(this.identifier, controller.${exportName});
${spaces}        });
${spaces}    }
${spaces}}`;
}
