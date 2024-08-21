import { VitePluginSymfonyFosRoutingOptions } from "~/types";
import vitePluginSymfonyFosRouting from "~/fos-routing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLogger } from "vite";
import { resolvePluginOptions } from "~/pluginOptions";
import { resolve } from "node:path";

vi.mock("node:child_process");
vi.mock("node:fs");

const rootDir = "/path/to/project";

function createPlugin(fosRoutingOptions: Partial<VitePluginSymfonyFosRoutingOptions> = {}): any {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fosRouting, ...otherOptions } = resolvePluginOptions({ fosRouting: fosRoutingOptions });
  if (!fosRouting) {
    throw new Error("resolved options are not boolean");
  }
  const plugin = vitePluginSymfonyFosRouting(fosRouting, createLogger());
  // @ts-ignore
  plugin.configResolved({ root: rootDir });
  return plugin;
}

describe("vitePluginSymfonyFosRouting", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should inject routes into the code if conditions are met", async () => {
    const plugin = createPlugin();

    const inputPath = "./some-file.js";
    const code = `import Routing from 'fos-router';`;

    plugin.buildStart({
      input: {
        app: inputPath,
      },
    });

    const result = await plugin.transform(code, resolve(rootDir, inputPath));
    expect(result).toMatchInlineSnapshot(`
      "
      import Routing from "fos-router";
      import routes from "/path/to/project/assets/fosRoutes.json";
      Routing.setRoutingData(routes); 

              "
    `);
  });

  it("should add routing by default if file is entrypoint", async () => {
    const plugin = createPlugin();

    const inputPath = "./some-file.js";
    const code = "";

    plugin.buildStart({
      input: {
        app: inputPath,
      },
    });

    const result = await plugin.transform(code, resolve(rootDir, inputPath));
    expect(result).toMatchInlineSnapshot(`
      "
      import Routing from "fos-router";
      import routes from "/path/to/project/assets/fosRoutes.json";
      Routing.setRoutingData(routes); 

              "
    `);
  });

  it("should not add routing by default if file is entrypoint", async () => {
    const plugin = createPlugin({
      addImportByDefault: false,
    });

    const inputPath = "./some-file.js";

    plugin.buildStart({
      input: {
        app: inputPath,
      },
    });

    const result = await plugin.transform("", resolve(rootDir, inputPath));
    expect(result).toMatchInlineSnapshot(`""`);
  });

  it("should not inject routes if conditions are not met", async () => {
    const plugin = createPlugin();
    const code = `import Routing from "fos-router";`;
    const id = "some-file.css";

    const result = await plugin.transform(code, id);

    expect(result).toBe(null);
  });
});
