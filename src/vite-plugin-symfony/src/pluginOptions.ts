import { join } from "node:path";
import { VitePluginSymfonyOptions } from "./types";
import { trimSlashes } from "./entrypoints/utils";

export function resolvePluginOptions(userConfig: Partial<VitePluginSymfonyOptions> = {}): VitePluginSymfonyOptions {
  if (typeof userConfig.servePublic === "undefined") {
    userConfig.servePublic = "public";
  }

  if (
    typeof userConfig.sriAlgorithm === "string" &&
    ["sha256", "sha384", "sha512"].indexOf(userConfig.sriAlgorithm.toString()) === -1
  ) {
    userConfig.sriAlgorithm = false;
  }

  if (userConfig.stimulus === true) {
    userConfig.stimulus = {
      controllersFilePath: "./assets/controllers.json",
      hmr: true,
    };
  } else if (typeof userConfig.stimulus === "string") {
    userConfig.stimulus = {
      controllersFilePath: userConfig.stimulus,
      hmr: true,
    };
  } else if (typeof userConfig.stimulus === "object") {
    userConfig.stimulus = {
      controllersFilePath: userConfig.stimulus.controllersFilePath ?? "./assets/controllers.json",
      hmr: userConfig.stimulus.hmr !== false ? true : false,
    };
  } else {
    userConfig.stimulus = false;
  }

  return {
    debug: userConfig.debug === true,
    enforcePluginOrderingPosition: userConfig.enforcePluginOrderingPosition === false ? false : true,
    enforceServerOriginAfterListening: userConfig.enforceServerOriginAfterListening === false ? false : true,
    exposedEnvVars: userConfig.exposedEnvVars ?? ["APP_ENV"],
    originOverride: userConfig.originOverride ?? null,
    refresh: userConfig.refresh ?? false,
    servePublic: userConfig.servePublic,
    sriAlgorithm: userConfig.sriAlgorithm ?? false,
    stimulus: userConfig.stimulus,
    viteDevServerHostname: userConfig.viteDevServerHostname ?? null,
  };
}

export function resolveOutDir(base: string): string {
  const publicDirectory = "public";

  return join(publicDirectory, trimSlashes(base));
}

export const refreshPaths = ["templates/**/*.twig"];
