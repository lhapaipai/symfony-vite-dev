import { Plugin, createLogger } from "vite";
import symfonyEntrypoints from "./entrypoints";
import symfonyStimulus from "./stimulus";

import { VitePluginSymfonyOptions } from "./types";
import { resolvePluginOptions } from "./pluginOptions";

export default function symfony(userOptions: Partial<VitePluginSymfonyOptions> = {}): Plugin[] {
  const { stimulus: stimulusOptions, ...entrypointsOptions } = resolvePluginOptions(userOptions);

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
