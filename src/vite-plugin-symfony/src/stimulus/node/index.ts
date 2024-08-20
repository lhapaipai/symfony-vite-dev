import { createControllersModule, virtualSymfonyControllersModuleId, parseStimulusRequest } from "./bridge";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Logger, Plugin, ResolvedConfig, UserConfig } from "vite";
import { VitePluginSymfonyStimulusOptions } from "~/types";
import { ControllersFileContent } from "../types";
import { addBootstrapHmrCode, addControllerHmrCode } from "./hmr";
import { getStimulusControllerId } from "../util";

const stimulusRE = /\?stimulus\b/;

const isStimulusRequest = (request: string): boolean => stimulusRE.test(request);

export default function symfonyStimulus(pluginOptions: VitePluginSymfonyStimulusOptions, logger: Logger): Plugin {
  let viteConfig: ResolvedConfig;
  let viteCommand: string;
  let stimulusControllersContent: ControllersFileContent | null = null;
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
        if (stimulusControllersContent) {
          return createControllersModule(stimulusControllersContent, logger);
        } else {
          return `export default [];`;
        }
      }
    },
    transform(code, id, options) {
      if ((options?.ssr && !process.env.VITEST) || id.includes("node_modules")) {
        return null;
      }

      if (isStimulusRequest(id)) {
        return parseStimulusRequest(code, id);
      }

      if (viteCommand === "serve") {
        if (id.endsWith("bootstrap.js") || id.endsWith("bootstrap.ts")) {
          return addBootstrapHmrCode(code, logger);
        }

        const identifier = getStimulusControllerId(id, true);
        if (identifier) {
          logger.info(`import controller ${identifier}`);
          return addControllerHmrCode(code, identifier);
        }
      }

      return null;
    },
    configureServer(devServer) {
      const { watcher } = devServer;
      watcher.on("change", (path) => {
        if (path === controllersFilePath) {
          logger.info("✨ controllers.json updated, we restart server.");
          devServer.restart();
        }
      });
    },
  };
}
