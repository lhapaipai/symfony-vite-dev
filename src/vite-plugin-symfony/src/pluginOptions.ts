import { join } from "node:path";
import {
  VitePluginSymfonyFosRoutingOptions,
  VitePluginSymfonyOptions,
  VitePluginSymfonyPartialOptions,
  VitePluginSymfonyStimulusOptions,
} from "./types";
import { deepMerge } from "~/fos-routing/utils";

import { trimSlashes } from "./entrypoints/utils";

export function resolvePluginOptions(userConfig: VitePluginSymfonyPartialOptions = {}): VitePluginSymfonyOptions {
  if (typeof userConfig.servePublic === "undefined") {
    userConfig.servePublic = "public";
  }

  if (
    typeof userConfig.sriAlgorithm === "string" &&
    ["sha256", "sha384", "sha512"].indexOf(userConfig.sriAlgorithm.toString()) === -1
  ) {
    userConfig.sriAlgorithm = false;
  }

  let definitiveStimulusOptions: VitePluginSymfonyStimulusOptions | false;
  if (userConfig.stimulus === true) {
    definitiveStimulusOptions = {
      controllersFilePath: "./assets/controllers.json",
      hmr: true,
    };
  } else if (typeof userConfig.stimulus === "string") {
    definitiveStimulusOptions = {
      controllersFilePath: userConfig.stimulus,
      hmr: true,
    };
  } else if (typeof userConfig.stimulus === "object") {
    definitiveStimulusOptions = {
      controllersFilePath: userConfig.stimulus.controllersFilePath ?? "./assets/controllers.json",
      hmr: userConfig.stimulus.hmr !== false ? true : false,
    };
  } else {
    definitiveStimulusOptions = false;
  }

  /**
   * Default options for fos-routing plugin.
   */
  const defaultFosRouterPluginOptions = {
    args: {
      target: "var/cache/fosRoutes.json",
      format: "json",
      locale: "",
      prettyPrint: false,
      domain: [],
      extraArgs: {},
    },
    addImportByDefault: true,
    routingPluginPackageName: "fos-router",
    watchPaths: ["src/**/*.php"],
    possibleRoutesConfigFilesExt: ["php"],
    verbose: false,
    php: "php",
  } satisfies VitePluginSymfonyFosRoutingOptions;
  let definitiveFosRoutingOptions: VitePluginSymfonyFosRoutingOptions | false;
  if (userConfig.fosRouting === true) {
    definitiveFosRoutingOptions = defaultFosRouterPluginOptions;
  } else if (typeof userConfig.fosRouting === "object") {
    definitiveFosRoutingOptions = deepMerge(defaultFosRouterPluginOptions, userConfig.fosRouting);
  } else {
    definitiveFosRoutingOptions = false;
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
    stimulus: definitiveStimulusOptions,
    fosRouting: definitiveFosRoutingOptions,
    viteDevServerHostname: userConfig.viteDevServerHostname ?? null,
  };
}

export function resolveOutDir(unknownBase: string): string {
  const baseURL = new URL(unknownBase, import.meta.url);

  const base = baseURL.protocol === "file:" ? unknownBase : baseURL.pathname;
  const publicDirectory = "public";

  return join(publicDirectory, trimSlashes(base));
}

export const refreshPaths = ["templates/**/*.twig"];
