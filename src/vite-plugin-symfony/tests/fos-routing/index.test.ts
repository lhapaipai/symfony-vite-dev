import { VitePluginSymfonyFosRoutingOptions } from "~/types";
import vitePluginSymfonyFosRouting from "~/fos-routing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLogger } from "vite";
import { resolvePluginOptions } from "~/pluginOptions";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

vi.mock("node:child_process", () => ({
  execFileSync: vi.fn(),
}));

vi.mock("node:process", async (importOriginal) => {
  const originalProcess = await importOriginal<typeof import("node:process")>();

  return {
    ...originalProcess,
    cwd: vi.fn(() => "/path/to/project"),
  };
});

vi.mock("node:fs", async (importOriginal) => {
  const originalFs = await importOriginal<typeof import("node:fs")>();

  return {
    ...originalFs,
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    rmSync: vi.fn(),
    mkdirSync: vi.fn(),
    existsSync: vi.fn(),
  };
});

vi.mock("node:path", async (importOriginal) => {
  const originalPath = await importOriginal<typeof import("node:path")>();

  return {
    ...originalPath,
    resolve: vi.fn((...args) => args.join("/")),
    dirname: vi.fn((p) => p.split("/").slice(0, -1).join("/")),
    sep: "/",
  };
});

function createPlugin(fosRoutingOptions: Partial<VitePluginSymfonyFosRoutingOptions> = {}): any {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fosRouting, ...otherOptions } = resolvePluginOptions({ fosRouting: fosRoutingOptions });
  if (!fosRouting) {
    throw new Error("resolved options are not boolean");
  }
  return vitePluginSymfonyFosRouting(fosRouting, createLogger());
}

describe("vitePluginSymfonyFosRouting", () => {
  beforeEach(() => {
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
    const plugin = createPlugin({
      routingPluginPackageName: type,
    });
    vi.mocked(resolve).mockReturnValue("/some-file.js");

    plugin.buildStart({
      input: "./some-file.js",
    });

    const id = "/some-file.js";
    const result = await plugin.transform(code, id);

    expect(result.code).toContain(`
import Routing from "${type}";
import routes from undefined;
Routing.setRoutingData(routes); \n
        `);
  });

  it("should add routing by default if file is entrypoint", async () => {
    const plugin = createPlugin();

    vi.mocked(resolve).mockReturnValue("/some-file.js");

    plugin.buildStart({
      input: "./some-file.js",
    });

    const id = "/some-file.js";
    vi.mocked(readFileSync).mockReturnValue(Buffer.from('{"route":"data"}'));

    const result = await plugin.transform("", id);
    expect(result.code).toMatchInlineSnapshot(`
      "
      import Routing from "fos-router";
      import routes from undefined;
      Routing.setRoutingData(routes); 

              "
    `);
  });

  it("should not add routing by default if file is entrypoint", async () => {
    const plugin = createPlugin({
      addImportByDefault: false,
    });
    vi.mocked(resolve).mockReturnValue("/some-file.js");

    plugin.buildStart({
      input: "./some-file.js",
    });

    const id = "/some-file.js";
    vi.mocked(readFileSync).mockReturnValue(Buffer.from('{"route":"data"}'));

    const result = await plugin.transform("", id);
    expect(result.code).toMatchInlineSnapshot(`""`);
  });

  it("should not inject routes if conditions are not met", async () => {
    const plugin = createPlugin({
      addImportByDefault: false,
    });
    const code = `import Routing from "fos-router";`;
    const id = "some-file.css";

    const result = await plugin.transform(code, id);

    expect(result.code).toBe(code);
  });
});
