import { describe, it } from "vitest";
import { resolvePluginEntrypointsOptions, resolveOutDir } from "./pluginOptions";

describe("resolvePluginEntrypointsOptions", () => {
  it("resolves with default options when no config", ({ expect }) => {
    expect(resolvePluginEntrypointsOptions()).toMatchInlineSnapshot(`
      {
        "debug": false,
        "enforcePluginOrderingPosition": true,
        "enforceServerOriginAfterListening": true,
        "exposedEnvVars": [
          "APP_ENV",
        ],
        "originOverride": null,
        "refresh": false,
        "servePublic": "public",
        "sriAlgorithm": false,
        "viteDevServerHostname": null,
      }
    `);
  });
});

describe("resolveOutDir", () => {
  it("resolve correctely `build.outDir` vite config option", ({ expect }) => {
    expect(resolveOutDir("/build/")).toBe("public/build");
    expect(resolveOutDir("custom/build")).toBe("public/custom/build");
    expect(resolveOutDir("https://other.com/build")).toBe("public/build");
    expect(resolveOutDir("https://other.com/")).toBe("public");
    expect(resolveOutDir("https://other.com")).toBe("public");
  });
});
