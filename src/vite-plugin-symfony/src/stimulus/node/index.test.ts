/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ConfigEnv, Logger, UserConfig, createLogger } from "vite";
import { describe, it, vi } from "vitest";
import symfonyStimulus from "./index";
import { resolvePluginStimulusOptions } from "~/stimulus/pluginOptions";
import { VitePluginSymfonyStimulusOptions } from "~/types";

const generateStimulusPlugin = async (
  command: "build" | "serve",
  userPluginStimulusOptions: Partial<VitePluginSymfonyStimulusOptions> = {},
) => {
  const stimulusOptions = resolvePluginStimulusOptions(userPluginStimulusOptions);
  if (!stimulusOptions) {
    throw new Error("need to be enabled");
  }
  const logger: Logger = {
    ...createLogger(),
    info: vi.fn(),
  };
  const plugin = symfonyStimulus(stimulusOptions, logger);
  const userConfig: UserConfig = {};
  const envConfig: ConfigEnv = { command, mode: "development" };
  // @ts-ignore
  await plugin.configResolved({
    root: "/path/to/project",
  });
  // @ts-ignore
  plugin.config(userConfig, envConfig);

  return plugin;
};
describe("stimulus index", () => {
  it("inject correctly Application global var when server is started", async ({ expect }) => {
    const plugin = await generateStimulusPlugin("serve");
    // @ts-ignore
    const returnValue = plugin.transform(`const myApp = startStimulusApp();`, "/path/to/project/bootstrap.js", {});
    expect(returnValue).toMatchInlineSnapshot(`
      "const myApp = startStimulusApp();
      window.$$stimulusApp$$ = myApp"
    `);
  });
  it("doesn't insert Application global var when startStimulusApp is not present", async ({ expect }) => {
    const plugin = await generateStimulusPlugin("serve");
    // @ts-ignore
    const returnValue = plugin.transform(`const hello = "world;`, "/path/to/project/bootstrap.js", {});
    expect(returnValue).toBeNull();
  });
  it("doesn't insert Application global var when server is started", async ({ expect }) => {
    const plugin = await generateStimulusPlugin("build");
    // @ts-ignore
    const returnValue = plugin.transform(`const myApp = startStimulusApp();`, "/path/to/project/bootstrap.js", {});
    expect(returnValue).toBeNull();
  });

  it("inject correctly Controller hot accept", async ({ expect }) => {
    const plugin = await generateStimulusPlugin("serve");
    // @ts-ignore
    const returnValue = plugin.transform(
      `export default class controller extends Controller {}`,
      "/path/to/project/assets/controllers/welcome_controller.js",
      {},
    );
    expect(returnValue).toMatchInlineSnapshot(`
      "export default class controller extends Controller {}

      if (import.meta.hot) {
        import.meta.hot.accept(newModule => {
          if (!window.$$stimulusApp$$) {
            console.warn('Stimulus app not available. Are you creating app with startStimulusApp() ?');
            import.meta.hot.invalidate();
          } else {
            if (window.$$stimulusApp$$.router.modulesByIdentifier.has('welcome') && newModule.default) {
              window.$$stimulusApp$$.register('welcome', newModule.default);
            } else {
              console.warn('Try to HMR not registered Stimulus controller', 'welcome', 'full-reload');
              import.meta.hot.invalidate();
            }
          }
        })
      }"
    `);
  });
  it("doesn't insert Controller hot accept", async ({ expect }) => {
    const plugin = await generateStimulusPlugin("serve");
    // @ts-ignore
    const returnValue = plugin.transform(
      `export default class controller extends Controller {}`,
      "/not/in/the/root/project/dir/assets/other.js",
      {},
    );
    expect(returnValue).toBeNull();
  });
});
