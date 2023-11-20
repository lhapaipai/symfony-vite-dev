import { createControllersModule, virtualSymfonyControllersModuleId } from "./node/bridge";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Logger, Plugin, ResolvedConfig, UserConfig } from "vite";
import { VitePluginSymfonyStimulusOptions } from "~/types";
import { getStimulusControllerFileInfos } from "./helpers/util";

const applicationGlobalVarName = "$$stimulusApp$$";

export default function symfonyStimulus(pluginOptions: VitePluginSymfonyStimulusOptions, logger: Logger): Plugin {
  let viteConfig: ResolvedConfig;
  let viteCommand: string;
  let stimulusControllersContent = null;
  let controllersFilePath: string;
  return {
    name: "symfony-stimulus",
    config(userConfig, { command }) {
      viteCommand = command;
      const extraConfig: UserConfig = {
        optimizeDeps: {
          exclude: [...(userConfig?.optimizeDeps?.exclude ?? []), virtualSymfonyControllersModuleId],
        },
      };

      return extraConfig;
    },
    configResolved(config) {
      viteConfig = config;

      controllersFilePath = resolve(viteConfig.root, pluginOptions.controllersFilePath);
      stimulusControllersContent = JSON.parse(readFileSync(controllersFilePath).toString());
    },
    resolveId(id: string) {
      if (id === virtualSymfonyControllersModuleId) {
        return id;
      }
    },
    load(id) {
      if (id === virtualSymfonyControllersModuleId) {
        return createControllersModule(stimulusControllersContent);
      }
    },
    transform(code, id, options) {
      if (viteCommand !== "serve") {
        return;
      }
      if (options?.ssr || process.env.VITEST) {
        return;
      }

      if (id.endsWith("bootstrap.js") || id.endsWith("bootstrap.ts")) {
        const appRegex = /[^\n]*?\s(\w+)(?:\s*=\s*startStimulusApp\(\))/;
        const appVariable = (code.match(appRegex) || [])[1];
        if (appVariable) {
          logger.info(`appVariable ${appVariable}`, { timestamp: true });
          const exportFooter = `window.${applicationGlobalVarName} = ${appVariable}`;
          return `${code}\n${exportFooter}`;
        }
        return null;
      }

      // we don't need lazy behavior, the module is already loaded and we are in a dev environment
      const { identifier } = getStimulusControllerFileInfos(id, true);
      if (!identifier) return;
      logger.info(`controller ${identifier}`, { timestamp: true });

      const metaHotFooter = `
        if (import.meta.hot) {
          import.meta.hot.accept(newModule => {
            if (!window.${applicationGlobalVarName}) {
              console.warn('Simulus app not available. Are you creating app with startStimulusApp() ?');
              import.meta.hot.invalidate();
            } else {
              window.${applicationGlobalVarName}.register('${identifier}', newModule.default);
            }
          })
        } 
      `;

      return `${code}\n${metaHotFooter}`;
    },
    configureServer(devServer) {
      const { watcher } = devServer;
      watcher.on("change", (path) => {
        if (path === controllersFilePath) {
          logger.info("✨ controllers.json updated, we restart server.", { timestamp: true });
          devServer.restart();
        }
      });
    },
  };
}
