import { VitePluginSymfonyFosRoutingOptions } from "~/types";
import { deepMerge } from "~/fos-routing/utils";

export function resolvePluginFosRoutingOptions(
  userConfig?: boolean | string | Partial<VitePluginSymfonyFosRoutingOptions>,
): false | VitePluginSymfonyFosRoutingOptions {
  let config: false | VitePluginSymfonyFosRoutingOptions;
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
    watchPaths: ["src/Controller/**/.php", "config/routes/.yaml", "config/routes.yaml"],
    possibleRoutesConfigFilesExt: ["php"],
    verbose: false,
    php: "php",
  };

  if (userConfig.fosRouting === true) {
    config = defaultFosRouterPluginOptions;
  } else if (typeof userConfig.fosRouting === "object") {
    config = deepMerge(defaultFosRouterPluginOptions, userConfig.fosRouting);
  } else {
    config= false;
  }

  return config;
}
