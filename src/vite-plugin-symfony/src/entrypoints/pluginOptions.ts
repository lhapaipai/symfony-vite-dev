import { VitePluginSymfonyEntrypointsOptions } from "~/types";
import { trimSlashes } from "./utils";
import { join } from "node:path";

export function resolvePluginEntrypointsOptions(
  userConfig: Partial<VitePluginSymfonyEntrypointsOptions> = {},
): VitePluginSymfonyEntrypointsOptions {
  if (typeof userConfig.servePublic === "undefined") {
    userConfig.servePublic = "public";
  }

  if (
    typeof userConfig.sriAlgorithm === "string" &&
    ["sha256", "sha384", "sha512"].indexOf(userConfig.sriAlgorithm.toString()) === -1
  ) {
    userConfig.sriAlgorithm = false;
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
