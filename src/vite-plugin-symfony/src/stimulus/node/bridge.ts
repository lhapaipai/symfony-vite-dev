import { Logger } from "vite";
import { ControllersFileContent } from "../types";
import { generateStimulusId } from "../util";
import { createRequire } from "node:module";

export const virtualSymfonyControllersModuleId = "virtual:symfony/controllers";

export function createControllersModule(config: ControllersFileContent, logger?: Logger) {
  const require = createRequire(import.meta.url);
  const controllerContents: string[] = [];
  let importStatementContents = "";
  let controllerIndex = 0;

  if ("undefined" === typeof config["controllers"]) {
    throw new Error('Your Stimulus configuration file (assets/controllers.json) lacks a "controllers" key.');
  }

  for (const packageName in config.controllers) {
    let packageJsonContent: any = null;
    let packageNameResolved;

    if (packageName === "@symfony/ux-svelte" || packageName === "@symfony/ux-react") {
      packageNameResolved = "vite-plugin-symfony";
    } else {
      packageNameResolved = packageName;
    }

    try {
      // https://nodejs.org/api/esm.html#import-attributes
      // TODO : change to this when stable
      // packageJsonContent = (await import(`${packageName}/package.json`, { assert: { type: "json" } })).default;
      packageJsonContent = require(`${packageNameResolved}/package.json`);
    } catch (error: any) {
      logger?.error(
        `The file "${packageNameResolved}/package.json" could not be found. Try running "npm install --force".`,
        { error },
      );
    }

    // package can define multiple stimulus controllers
    // used only by @symfony/ux-turbo : turbo-core, mercure-turbo-stream
    for (const controllerName in config.controllers[packageName]) {
      const controllerPackageConfig = packageJsonContent?.symfony?.controllers?.[controllerName] || {};
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
      const controllerMain = `${packageNameResolved}/${controllerUserConfig.main ?? controllerPackageConfig.main ?? packageJsonContent.module ?? packageJsonContent.main}`;
      const fetchMode = controllerUserConfig.fetch ?? controllerPackageConfig.fetch ?? "eager";

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
        // moduleValueContents = generateLazyController(controllerMain);
        moduleValueContents = `() => import("${controllerMain}")`;
      } else {
        throw new Error(`Invalid fetch mode "${fetchMode}" in controllers.json. Expected "eager" or "lazy".`);
      }

      let controllerId = generateStimulusId(`${packageName}/${controllerName}`);
      // allow the package or user config to override name
      // used by ux-live-component
      if ("undefined" !== typeof controllerPackageConfig.name) {
        controllerId = controllerPackageConfig.name.replace(/\//g, "--");
      }
      if ("undefined" !== typeof controllerUserConfig.name) {
        controllerId = controllerUserConfig.name.replace(/\//g, "--");
      }

      controllerContents.push(`{
        enabled: true,
        fetch: "${fetchMode}",
        identifier: "${controllerId}",
        controller: ${moduleValueContents}
      }`);

      if (controllerUserConfig.autoimport) {
        for (const autoimport in controllerUserConfig.autoimport) {
          if (controllerUserConfig.autoimport[autoimport]) {
            importStatementContents += "import '" + autoimport + "';\n";
          }
        }
      }
    }
  }

  const moduleContent = `${importStatementContents}\nexport default [\n${controllerContents.join(",\n")}\n];\n`;
  return moduleContent;
}

const stimulusFetchRE = /\bimport\.meta\.stimulusFetch\s*=\s*["'](eager|lazy)["']/;
const stimulusControllerIdentifierRE =
  /\bimport\.meta\.stimulusControllerIdentifier\s*=\s*["']([a-zA-Z][-_a-zA-Z0-9]*)["']/;
const stimulusEnabledRE = /\bimport\.meta\.stimulusEnabled\s*=\s*(true|false)/;

export function parseStimulusRequest(code: string, moduleId: string) {
  const filePath = moduleId.slice(0, -"?stimulus".length);

  const fetch = (code.match(stimulusFetchRE) || [])[1] ?? "eager";
  let id = (code.match(stimulusControllerIdentifierRE) || [])[1];
  if (!id) {
    id = generateStimulusId(moduleId);
  }
  const enabled = ((code.match(stimulusEnabledRE) || [])[1] ?? "true") === "false" ? false : true;

  if (fetch === "eager") {
    return `
        import Controller from '${filePath}';
        export default {
        enabled: ${enabled},
        fetch: 'eager',
        identifier: '${id}',
        controller: Controller
      }`;
  } else {
    return `export default {
      enabled: ${enabled},
      fetch: 'lazy',
      identifier: '${id}',
      controller: () => import('${filePath}')
    }`;
  }
}
