import { Plugin } from "vite";
import symfonyEntrypoints from "./entrypoints";
import symfonyStimulus from "./stimulus";
import symfonyFosRouting from "./fos-routing";

import { VitePluginSymfonyOptions } from "./types";
import { resolvePluginOptions } from "./pluginOptions";
import { createLogger } from "./logger";

export default function symfony(userOptions: Partial<VitePluginSymfonyOptions> = {}): Plugin[] {
  const { stimulus: stimulusOptions, fosRouting: fosRoutingOptions, ...entrypointsOptions } = resolvePluginOptions(userOptions);

  const plugins: Plugin[] = [
    symfonyEntrypoints(
      entrypointsOptions,
      createLogger("info", { prefix: "[symfony:entrypoints]", allowClearScreen: true }),
    ),
  ];

  if (typeof stimulusOptions === "object") {
    plugins.push(
      symfonyStimulus(stimulusOptions, createLogger("info", { prefix: "[symfony:stimulus]", allowClearScreen: true })),
    );
  }

  if (typeof fosRoutingOptions === "object") {
    plugins.push(
        symfonyFosRouting(fosRoutingOptions, createLogger("info", { prefix: "[symfony:fos-routing]", allowClearScreen: true })) as Plugin,
    );
  }

  return plugins;
}
