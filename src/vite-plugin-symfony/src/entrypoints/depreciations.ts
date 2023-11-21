import { Logger } from "~/logger";
import { resolveBase, resolveOutDir } from "~/pluginOptions";
import { VitePluginSymfonyEntrypointsOptions } from "~/types";

export function showDepreciationsWarnings(pluginOptions: VitePluginSymfonyEntrypointsOptions, logger: Logger) {
  if (typeof pluginOptions.buildDirectory !== "undefined") {
    logger.error(
      `"buildDirectory" plugin option is deprecated and will be removed in v5.x use base: "${resolveBase(
        pluginOptions,
      )}" from vite config instead`,
    );
  }
  if (typeof pluginOptions.publicDirectory !== "undefined") {
    logger.error(
      `"publicDirectory" plugin option is deprecated and will be removed in v5.x use build.outDir: "${resolveOutDir(
        pluginOptions,
      )}" from vite config instead`,
    );
  }
}
