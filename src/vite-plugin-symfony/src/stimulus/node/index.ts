import { createControllersModule, virtualSymfonyControllersModuleId, parseStimulusRequest } from "./bridge";
import { relative, resolve } from "node:path";
import { Logger, Plugin, ResolvedConfig, UserConfig } from "vite";
import { VitePluginSymfonyStimulusOptions } from "~/types";
import { ControllersFileContent } from "../types";
import { addBootstrapHmrCode, addControllerHmrCode } from "./hmr";
import { getStimulusControllerId } from "../util";
import { isPathIncluded } from "./utils";
import { readFile, stat } from "node:fs/promises";

const stimulusRE = /\?stimulus\b/;
const virtualRE = /^virtual:/;

const isStimulusRequest = (request: string): boolean => stimulusRE.test(request);
const isVirtualRequest = (request: string): boolean => virtualRE.test(request);

export default function symfonyStimulus(pluginOptions: VitePluginSymfonyStimulusOptions, logger: Logger) {
  let viteConfig: ResolvedConfig;
  let viteCommand: string;
  let controllersJsonContent: ControllersFileContent | null = null;
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
    async configResolved(config) {
      viteConfig = config;

      controllersFilePath = resolve(viteConfig.root, pluginOptions.controllersFilePath);
      try {
        await stat(controllersFilePath);
        controllersJsonContent = JSON.parse((await readFile(controllersFilePath)).toString());
      } catch {
        controllersJsonContent = {
          controllers: {},
          entrypoints: {},
        };
      }
    },
    resolveId(id: string) {
      if (id === virtualSymfonyControllersModuleId) {
        return id;
      }
    },
    load(id) {
      if (id === virtualSymfonyControllersModuleId) {
        if (controllersJsonContent) {
          return createControllersModule(controllersJsonContent, pluginOptions, logger);
        } else {
          return `export default [];`;
        }
      }
    },
    transform(code, id, options) {
      if ((options?.ssr && !process.env.VITEST) || id.includes("node_modules") || isVirtualRequest(id)) {
        return null;
      }

      if (isStimulusRequest(id)) {
        return parseStimulusRequest(code, id, pluginOptions, viteConfig);
      }

      if (viteCommand === "serve") {
        if (id.endsWith("bootstrap.js") || id.endsWith("bootstrap.ts")) {
          return addBootstrapHmrCode(code, logger);
        }

        if (isPathIncluded(viteConfig.root, id)) {
          const relativePath = relative(viteConfig.root, id);
          const identifier = getStimulusControllerId(relativePath, pluginOptions.identifierResolutionMethod);
          if (identifier) {
            return addControllerHmrCode(code, identifier);
          }
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
  } satisfies Plugin;
}
