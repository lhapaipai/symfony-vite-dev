import { join } from "node:path";
import { VitePluginSymfonyEntrypointsOptions, VitePluginSymfonyOptions } from "./types";

export function resolvePluginOptions(userConfig: Partial<VitePluginSymfonyOptions> = {}): VitePluginSymfonyOptions {
  if (typeof userConfig.publicDirectory === "string") {
    userConfig.publicDirectory = userConfig.publicDirectory.trim().replace(/^\/+/, "").replace(/\/+$/, "");

    if (userConfig.publicDirectory === "") {
      throw new Error("vite-plugin-symfony: publicDirectory must be a subdirectory. E.g. 'public'.");
    }
  }

  if (typeof userConfig.buildDirectory === "string") {
    userConfig.buildDirectory = userConfig.buildDirectory.trim().replace(/^\/+/, "").replace(/\/+$/, "");

    if (userConfig.buildDirectory === "") {
      throw new Error("vite-plugin-symfony: buildDirectory must be a subdirectory. E.g. 'build'.");
    }
  }

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
    originOverride: userConfig.originOverride ?? null,
    buildDirectory: userConfig.buildDirectory,
    publicDirectory: userConfig.publicDirectory,
    refresh: userConfig.refresh ?? false,
    servePublic: userConfig.servePublic,
    debug: userConfig.debug === true,
    viteDevServerHostname: userConfig.viteDevServerHostname ?? null,
    sriAlgorithm: userConfig.sriAlgorithm ?? false,
    enforcePluginOrderingPosition: userConfig.enforcePluginOrderingPosition === false ? false : true,
    enforceServerOriginAfterListening: userConfig.enforceServerOriginAfterListening === false ? false : true,
    stimulus: userConfig.stimulus,
  };
}

export function resolveBase(config: VitePluginSymfonyEntrypointsOptions): string {
  if (typeof config.buildDirectory !== "undefined") {
    return "/" + config.buildDirectory + "/";
  }
  return "/build/";
}

export function resolveOutDir(config: VitePluginSymfonyEntrypointsOptions): string {
  let publicDirectory = "public";
  let buildDirectory = "build";
  if (typeof config.publicDirectory !== "undefined") {
    publicDirectory = config.publicDirectory;
  }
  if (typeof config.buildDirectory !== "undefined") {
    buildDirectory = config.buildDirectory;
  }
  return join(publicDirectory, buildDirectory);
}

export function resolvePublicDir(config: VitePluginSymfonyEntrypointsOptions) {
  if (typeof config.publicDirectory !== "undefined") {
    return config.publicDirectory;
  }

  return config.servePublic === false ? null : config.servePublic;
}

export const refreshPaths = ["templates/**/*.twig"];
