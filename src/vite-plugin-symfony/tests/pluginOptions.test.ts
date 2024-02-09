import { describe, it } from "vitest";
import { resolvePluginOptions, resolveBase, resolveOutDir } from "~/pluginOptions";
import { VitePluginSymfonyOptions } from "~/types";

describe("resolvePluginOptions", () => {
  it("resolves with default options when no config", ({ expect }) => {
    expect(resolvePluginOptions()).toMatchInlineSnapshot(`
      {
        "buildDirectory": undefined,
        "debug": false,
        "enforcePluginOrderingPosition": true,
        "enforceServerOriginAfterListening": true,
        "exposedEnvVars": [
          "APP_ENV",
        ],
        "originOverride": null,
        "publicDirectory": undefined,
        "refresh": false,
        "servePublic": "public",
        "sriAlgorithm": false,
        "stimulus": false,
        "viteDevServerHostname": null,
      }
    `);
  });

  it("fix slash prefix for public and build directory", ({ expect }) => {
    expect(
      resolvePluginOptions({
        buildDirectory: "/my-build/depth/",
        publicDirectory: "/www/",
      }),
    ).toMatchInlineSnapshot(`
      {
        "buildDirectory": "my-build/depth",
        "debug": false,
        "enforcePluginOrderingPosition": true,
        "enforceServerOriginAfterListening": true,
        "exposedEnvVars": [
          "APP_ENV",
        ],
        "originOverride": null,
        "publicDirectory": "www",
        "refresh": false,
        "servePublic": "public",
        "sriAlgorithm": false,
        "stimulus": false,
        "viteDevServerHostname": null,
      }
    `);
  });
});

describe("resolveBase", () => {
  it("resolve correctely `base` vite config option", ({ expect }) => {
    expect(
      resolveBase({
        buildDirectory: "build",
      } as VitePluginSymfonyOptions),
    ).toBe("/build/");

    expect(
      resolveBase({
        buildDirectory: "custom/build",
      } as VitePluginSymfonyOptions),
    ).toBe("/custom/build/");
  });
});

describe("resolveOutDir", () => {
  it("resolve correctely `build.outDir` vite config option", ({ expect }) => {
    expect(
      resolveOutDir({
        buildDirectory: "build",
        publicDirectory: "public",
      } as VitePluginSymfonyOptions),
    ).toBe("public/build");

    expect(
      resolveOutDir({
        buildDirectory: "custom/build",
        publicDirectory: "www",
      } as VitePluginSymfonyOptions),
    ).toBe("www/custom/build");
  });
});
