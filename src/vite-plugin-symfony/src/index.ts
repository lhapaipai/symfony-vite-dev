import { Plugin } from "vite";
import symfonyEntrypoints from "./entrypoints";
import symfonyFosRouting from "./fos-routing";
import symfonyStimulus from "./stimulus/node";

import { VitePluginSymfonyPartialOptions } from "./types";
import { createLogger } from "./logger";
import { resolvePluginEntrypointsOptions } from "./entrypoints/pluginOptions";
import { resolvePluginStimulusOptions } from "./stimulus/pluginOptions";
import { resolvePluginFosRoutingOptions } from "~/fos-routing/pluginOptions";

export default function symfony(userPluginOptions: VitePluginSymfonyPartialOptions = {}): Plugin[] {
  const {
    stimulus: userStimulusOptions,
    fosRouting: fosRoutingOptions,
    ...userEntrypointsOptions } = userPluginOptions;

  const entrypointsOptions = resolvePluginEntrypointsOptions(userEntrypointsOptions);
  const stimulusOptions = resolvePluginStimulusOptions(userStimulusOptions);
  const fosRoutingOptions = resolvePluginFosRoutingOptions(fosRoutingOptions);

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
      symfonyFosRouting(
        fosRoutingOptions,
        createLogger("info", { prefix: "[symfony:fos-routing]", allowClearScreen: true }),
      ) as Plugin,
    );
  }

  return plugins;
}
