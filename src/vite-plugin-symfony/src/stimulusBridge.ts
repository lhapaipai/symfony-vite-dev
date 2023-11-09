import { generateStimulusId } from "./stimulus-helpers/util";

type ControllerUserConfig = {
  enabled: boolean;
  fetch: "eager" | "lazy";
  name: string;
  autoimport: {
    [path: string]: boolean;
  };
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

export async function createControllersModule(config: ControllersConfig) {
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
      packageConfig = (await import(`${packageName}/package.json`, { assert: { type: "json" } })).default;
    } catch (e) {
      console.log(`The file "${packageName}/package.json" could not be found. Try running "npm install --force".`);
    }

    for (const controllerName in config.controllers[packageName]) {
      const controllerReference = `${packageName}/${controllerName}`;

      if (packageConfig && "undefined" === typeof packageConfig.symfony.controllers[controllerName]) {
        throw new Error(`Controller "${controllerReference}" does not exist in the package and cannot be compiled.`);
      }

      const controllerPackageConfig = packageConfig?.symfony.controllers[controllerName] || {};
      const controllerUserConfig = config.controllers[packageName][controllerName];

      if (!controllerUserConfig.enabled) {
        continue;
      }

      const controllerMain = `${packageName}/${controllerPackageConfig.main}`;
      const fetchMode = controllerUserConfig.fetch || "eager";

      let moduleValueContents = ``;

      if (fetchMode === "eager") {
        const controllerNameForVariable = `controller_${controllerIndex++}`;
        importStatementContents += `import ${controllerNameForVariable} from '${controllerMain}';\n`;

        moduleValueContents = controllerNameForVariable;
      } else if (fetchMode === "lazy") {
        hasLazyControllers = true;
        moduleValueContents = generateLazyController(controllerMain, 2);
      } else {
        throw new Error(`Invalid fetch mode "${fetchMode}" in controllers.json. Expected "eager" or "lazy".`);
      }

      let controllerNormalizedName = generateStimulusId(controllerReference);

      // allow the package or user config to override name
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

  const moduleContent = `
    ${importStatementContents}
    export default {
      ${controllerContents.join(",\n")}
    };
  `;
  // console.log(moduleContent);
  return moduleContent;
}


// let controllerNormalizedName = controllerReference.substr(1).replace(/_/g, "-").replace(/\//g, "--");

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
