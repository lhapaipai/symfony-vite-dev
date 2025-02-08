import { Logger, ResolvedConfig } from "vite";
import { ControllersFileContent } from "../types";
import { generateStimulusId, getStimulusControllerId } from "../util";
import { createRequire } from "node:module";
import { VitePluginSymfonyStimulusOptions } from "~/types";
import { relative } from "node:path";

export const virtualSymfonyControllersModuleId = "virtual:symfony/controllers";

export function createControllersModule(
  controllersJsonContent: ControllersFileContent,
  pluginOptions: VitePluginSymfonyStimulusOptions,
  logger?: Logger,
) {
  const require = createRequire(import.meta.url);
  const controllerContents: string[] = [];
  let importStatementContents = "";
  let controllerIndex = 0;

  if ("undefined" === typeof controllersJsonContent["controllers"]) {
    throw new Error('Your Stimulus configuration file (assets/controllers.json) lacks a "controllers" key.');
  }

  for (const packageName in controllersJsonContent.controllers) {
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
    for (const controllerName in controllersJsonContent.controllers[packageName]) {
      const controllerPackageConfig = packageJsonContent?.symfony?.controllers?.[controllerName] || {};
      const controllerUserConfig = controllersJsonContent.controllers[packageName][controllerName];

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
      const packageMain =
        controllerUserConfig.module ??
        controllerUserConfig.main ??
        controllerPackageConfig.module ??
        controllerPackageConfig.main ??
        packageJsonContent.module ??
        packageJsonContent.main;
      const controllerMain = `${packageNameResolved}/${packageMain}`;

      const fetchMode = controllerUserConfig.fetch ?? controllerPackageConfig.fetch ?? pluginOptions.fetchMode;

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

const notACommentRE = /^(?<!\/[\\/\\*])\s*/;
const importMetaStimulusFetchRE = /import\.meta\.stimulusFetch\s*=\s*["'](eager|lazy)["']/;
const importMetaStimulusIdentifierRE = /import\.meta\.stimulusIdentifier\s*=\s*["']([a-zA-Z][-_a-zA-Z0-9]*)["']/;
const importMetaStimulusEnabledRE = /import\.meta\.stimulusEnabled\s*=\s*(true|false)/;

export const stimulusFetchRE = new RegExp(notACommentRE.source + importMetaStimulusFetchRE.source, "m");
export const stimulusIdentifierRE = new RegExp(notACommentRE.source + importMetaStimulusIdentifierRE.source, "m");
const stimulusEnabledRE = new RegExp(notACommentRE.source + importMetaStimulusEnabledRE.source, "m");

export function extractStimulusIdentifier(code: string): string | null {
  return (code.match(stimulusIdentifierRE) || [])[1] ?? null;
}

export function parseStimulusRequest(
  srcCode: string,
  moduleId: string,
  pluginOptions: VitePluginSymfonyStimulusOptions,
  viteConfig: ResolvedConfig,
) {
  let filePath: string;
  if (moduleId.endsWith("?stimulus")) {
    filePath = moduleId.slice(0, -"?stimulus".length);
  } else {
    filePath = moduleId;
  }

  const fetch = (srcCode.match(stimulusFetchRE) || [])[1] ?? pluginOptions.fetchMode;
  let id = extractStimulusIdentifier(srcCode);
  if (!id) {
    const relativePath = relative(viteConfig.root, filePath);
    id =
      getStimulusControllerId(relativePath, pluginOptions.identifierResolutionMethod) ??
      generateStimulusId(relativePath);
  }
  const enabled = ((srcCode.match(stimulusEnabledRE) || [])[1] ?? "true") === "false" ? false : true;

  const dstCode =
    fetch === "eager"
      ? `
        import Controller from '${filePath}';
        export default {
          enabled: ${enabled},
          fetch: 'eager',
          identifier: '${id}',
          controller: Controller
        }`
      : `
        export default {
          enabled: ${enabled},
          fetch: 'lazy',
          identifier: '${id}',
          controller: () => import('${filePath}')
        }`;

  return `${dstCode}\nif (import.meta.hot) { import.meta.hot.accept(); }`;
}
