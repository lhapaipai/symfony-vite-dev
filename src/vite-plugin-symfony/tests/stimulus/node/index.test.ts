import { ConfigEnv, Plugin, UserConfig, createLogger } from "vite";
import { describe, it, expect } from "vitest";
import symfonyStimulus from "~/stimulus/node";

const generateStimulusPlugin = (command: "build" | "serve") => {
  const plugin: Plugin = symfonyStimulus(
    {
      controllersFilePath: "./assets.controllers.json",
      hmr: true,
    },
    createLogger(),
  );
  const userConfig: UserConfig = {};
  const envConfig: ConfigEnv = { command, mode: "development" };
  // @ts-ignore
  plugin.config(userConfig, envConfig);

  return plugin;
};
describe("stimulus index", () => {
  it("inject correctly Application global var when server is started", () => {
    const plugin = generateStimulusPlugin("serve");
    // @ts-ignore
    const returnValue = plugin.transform(`const myApp = startStimulusApp();`, "/path/to/bootstrap.js", {});
    expect(returnValue).toMatchInlineSnapshot(`
      "const myApp = startStimulusApp();
      window.$$stimulusApp$$ = myApp"
    `);
  });
  it("doesn't insert Application global var when startStimulusApp is not present", () => {
    const plugin = generateStimulusPlugin("serve");
    // @ts-ignore
    const returnValue = plugin.transform(`const hello = "world;`, "/path/to/bootstrap.js", {});
    expect(returnValue).toBeNull();
  });
  it("doesn't insert Application global var when server is started", () => {
    const plugin = generateStimulusPlugin("build");
    // @ts-ignore
    const returnValue = plugin.transform(`const myApp = startStimulusApp();`, "/path/to/bootstrap.js", {});
    expect(returnValue).toBeNull();
  });

  it("inject correctly Controller hot accept", () => {
    const plugin = generateStimulusPlugin("serve");
    // @ts-ignore
    const returnValue = plugin.transform(
      `export default class controller extends Controller {}`,
      "/path/to/controllers/welcome_controller.js",
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
            window.$$stimulusApp$$.register('welcome', newModule.default);
          }
        })
      }"
    `);
  });
  it("doesn't insert Controller hot accept", () => {
    const plugin = generateStimulusPlugin("serve");
    // @ts-ignore
    const returnValue = plugin.transform(
      `export default class controller extends Controller {}`,
      "/path/to/assets/other.js",
      {},
    );
    expect(returnValue).toBeNull();
  });
});
