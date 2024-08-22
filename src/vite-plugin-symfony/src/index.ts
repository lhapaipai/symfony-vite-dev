import { Plugin } from "vite";
import symfonyEntrypoints from "./entrypoints";
import symfonyStimulus from "./stimulus/node";

import { VitePluginSymfonyPartialOptions } from "./types";
import { createLogger } from "./logger";
import { resolvePluginEntrypointsOptions } from "./entrypoints/pluginOptions";
import { resolvePluginStimulusOptions } from "./stimulus/pluginOptions";

export default function symfony(userPluginOptions: VitePluginSymfonyPartialOptions = {}): Plugin[] {
  const { stimulus: userStimulusOptions, ...userEntrypointsOptions } = userPluginOptions;

  const entrypointsOptions = resolvePluginEntrypointsOptions(userEntrypointsOptions);
  const stimulusOptions = resolvePluginStimulusOptions(userStimulusOptions);

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

  return plugins;
}
