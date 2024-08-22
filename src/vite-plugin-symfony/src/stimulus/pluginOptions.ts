import { VitePluginSymfonyStimulusOptions } from "~/types";

export function resolvePluginStimulusOptions(
  userConfig?: boolean | string | Partial<VitePluginSymfonyStimulusOptions>,
): false | VitePluginSymfonyStimulusOptions {
  let config: false | VitePluginSymfonyStimulusOptions;
  if (userConfig === true) {
    config = {
      controllersFilePath: "./assets/controllers.json",
      hmr: true,
      fetchMode: "eager",
      identifierResolutionMethod: "snakeCase",
    };
  } else if (typeof userConfig === "string") {
    config = {
      controllersFilePath: userConfig,
      hmr: true,
      fetchMode: "eager",
      identifierResolutionMethod: "snakeCase",
    };
  } else if (typeof userConfig === "object") {
    config = {
      controllersFilePath: userConfig.controllersFilePath ?? "./assets/controllers.json",
      hmr: userConfig.hmr !== false ? true : false,
      fetchMode: userConfig.fetchMode === "lazy" ? "lazy" : "eager",
      identifierResolutionMethod: userConfig.identifierResolutionMethod ?? "snakeCase",
    };
  } else {
    config = false;
  }
  return config;
}
