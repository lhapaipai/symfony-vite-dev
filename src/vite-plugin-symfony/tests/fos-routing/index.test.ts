import { VitePluginSymfonyFosRoutingOptions } from "~/types";
import symfonyFosRouting from "~/fos-routing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "node:fs";
/**
 * Tests:
 * - pluginOptions
 * - regex pattern for replace
 * @param command
 */

// const generateFosRouterPlugin = () => {
//   const plugin: Plugin = symfonyFosRouting({}, createLogger());
//
//   return plugin;
// };
//
// describe("fos-routing index", () => {
//   it("regex pattern replace #1", async () => {
//     const plugin = generateFosRouterPlugin();
//     // @ts-ignore
//     const returnValue = await plugin.transform(
//       `
//     import Routing from "fos-router";
//     `,
//       {},
//     );
//     console.log(returnValue);
//     expect(returnValue.code).toMatchInlineSnapshot(`
//         import Routing from "fos-router";
//         import routes from ;
//         Routing.setRoutingData(routes);
//     `);
//   });
// });

vi.mock("node:child_process", () => ({
  execFileSync: vi.fn(),
}));
vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  rmSync: vi.fn(),
  mkdirSync: vi.fn(),
  existsSync: vi.fn(),
}));
vi.mock("node:path", () => ({
  resolve: vi.fn((...args) => args.join("/")),
  dirname: vi.fn((p) => p.split("/").slice(0, -1).join("/")),
}));

describe("symfonyFosRouting Plugin", () => {
  let pluginOptions: VitePluginSymfonyFosRoutingOptions;
  let logger: Logger;

  beforeEach(() => {
    pluginOptions = {
      args: {
        target: "var/cache/fosRoutes.json",
        format: "json",
        locale: "",
        prettyPrint: false,
        domain: [],
        extraArgs: {},
      },
      transformCheckFileTypes: /\.(js|jsx|ts|tsx|vue)$/,
      watchPaths: ["src/**/*.php"],
      possibleRoutesConfigFilesExt: ["php"],
      verbose: false,
      php: "php",
    };
    logger = {
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as Logger;

    vi.resetAllMocks();
  });

  it("should execute the dump routes command", () => {
    const plugin = symfonyFosRouting(pluginOptions, logger);
    const runCmdSpy = vi.spyOn(plugin, "buildStart");

    plugin.buildStart();

    expect(runCmdSpy).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it.each([
    [`import Routing from 'fos-router';`],
    [`import Routing from "fos-router";`],
    [`import Routing from 'fos-router'`],
    [`import Routing from "fos-router"`],
    [`import Routing from 'symfony-ts-router';`],
    [`import Routing from "symfony-ts-router";`],
    [`import Routing from "symfony-ts-router"`],
    [`import Routing from 'symfony-ts-router'`],
  ])("should inject routes into the code if conditions are met", async (code) => {
    const plugin = symfonyFosRouting(pluginOptions, logger);
    plugin.buildStart();

    const id = "some-file.js";
    fs.readFileSync.mockReturnValue(Buffer.from('{"route":"data"}'));
    const result = await plugin.transform(code, id);

    expect(result.code).toContain(`
            import Routing from "fos-router";
            import routes from undefined;
            Routing.setRoutingData(routes);
    `);
  });

  it("should not inject routes if conditions are not met", async () => {
    const plugin = symfonyFosRouting(pluginOptions, logger);
    const code = `import Routing from "fos-router";`;
    const id = "some-file.css";

    const result = await plugin.transform(code, id);

    expect(result.code).toBe(code);
  });
});
