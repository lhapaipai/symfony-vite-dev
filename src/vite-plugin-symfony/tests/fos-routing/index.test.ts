import { VitePluginSymfonyFosRoutingOptions } from "~/types";
import symfonyFosRouting from "~/fos-routing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

vi.mock("node:child_process", () => ({
  execFileSync: vi.fn(),
}));

vi.mock("node:fs", async () => {
  const actualFs = await vi.importActual("node:fs");

  return {
    ...actualFs,
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    rmSync: vi.fn(),
    mkdirSync: vi.fn(),
    existsSync: vi.fn(),
  };
});

vi.mock("node:path", () => ({
  resolve: vi.fn((...args) => args.join("/")),
  dirname: vi.fn((p) => p.split("/").slice(0, -1).join("/")),
  sep: "/",
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

  it.each([
    [`import Routing from 'fos-router';`, "fos-router"],
    [`import Routing from "fos-router";`, "fos-router"],
    [`import Routing from 'fos-router'`, "fos-router"],
    [`import Routing from "fos-router"`, "fos-router"],
    [`import Routing from 'symfony-ts-router';`, "symfony-ts-router"],
    [`import Routing from "symfony-ts-router";`, "symfony-ts-router"],
    [`import Routing from "symfony-ts-router"`, "symfony-ts-router"],
    [`import Routing from 'symfony-ts-router'`, "symfony-ts-router"],
  ])("should inject routes into the code if conditions are met", async (code, type) => {
    pluginOptions.routingPluginPackageName = type;
    const plugin = symfonyFosRouting(pluginOptions, logger);
    path.resolve.mockReturnValue("/some-file.js");

    plugin.buildStart({
      input: "./some-file.js",
    });

    const id = "/some-file.js";
    fs.readFileSync.mockReturnValue(Buffer.from("{\"route\":\"data\"}"));
    const result = await plugin.transform(code, id);

    expect(result.code).toContain(`
import Routing from "${type}";
import routes from undefined;
Routing.setRoutingData(routes); \n
        `);
  });

  it("should add routing by default if file is entrypoint", async () => {
    const plugin = symfonyFosRouting(pluginOptions, logger);
    path.resolve.mockReturnValue("/some-file.js");

    plugin.buildStart({
      input: "./some-file.js",
    });

    const id = "/some-file.js";
    fs.readFileSync.mockReturnValue(Buffer.from("{\"route\":\"data\"}"));

    const result = await plugin.transform("", id);
    expect(result.code).toContain(`
import Routing from "fos-router";
import routes from undefined;
Routing.setRoutingData(routes); \n
        `);
  });

  it("should not add routing by default if file is entrypoint", async () => {
    pluginOptions.addImportByDefault = false;
    const plugin = symfonyFosRouting(pluginOptions, logger);
    path.resolve.mockReturnValue("/some-file.js");

    plugin.buildStart({
      input: "./some-file.js",
    });

    const id = "/some-file.js";
    fs.readFileSync.mockReturnValue(Buffer.from("{\"route\":\"data\"}"));

    const result = await plugin.transform("", id);
    expect(result.code).toContain(``);
  });

  it("should not inject routes if conditions are not met", async () => {
    const plugin = symfonyFosRouting(pluginOptions, logger);
    const code = `import Routing from "fos-router";`;
    const id = "some-file.css";

    const result = await plugin.transform(code, id);

    expect(result.code).toBe(code);
  });
});
