import { describe, it, vi } from "vitest";
import {
  getLegacyName,
  normalizePath,
  getFileInfos,
  getInputRelPath,
  prepareRollupInputs,
  isSubdirectory,
} from "../src/utils";
import { OutputChunk, OutputAsset, NormalizedOutputOptions } from "rollup";
import {
  asyncDepChunk,
  indexCss,
  legacyPolyfills,
  logoPng,
  pageAssets,
  themeCss,
  welcomeJs,
  welcomeLegacyJs,
} from "./mocks";
import type { ResolvedConfig } from "vite";
import { VitePluginSymfonyOptions } from "../src/types";

const viteBaseConfig = {
  root: "/home/me/project-dir",
  base: "/build/",
} as unknown as ResolvedConfig;

describe("normalizePath", () => {
  it("keep the path unchanged on UNIX", ({ expect }) => {
    expect(normalizePath("path/to/file.ts")).toBe("path/to/file.ts");
  });
});

describe("getLegacyName", () => {
  it("suffix pathname with -legacy before extension", ({ expect }) => {
    expect(getLegacyName("assets/page/assets/index.js")).toBe("assets/page/assets/index-legacy.js");
  });
});

describe("getFileInfos", () => {
  it("parse correctly an output", ({ expect }) => {
    expect(getFileInfos(asyncDepChunk, "assets/lib/async-dep.js", { sriAlgorithm: false } as VitePluginSymfonyOptions))
      .toMatchInlineSnapshot(`
        {
          "assets": [],
          "css": [],
          "dynamic": [],
          "hash": null,
          "imports": [],
          "inputRelPath": "assets/lib/async-dep.js",
          "js": [
            "assets/async-dep-e2ac9f96.js",
          ],
          "outputRelPath": "assets/async-dep-e2ac9f96.js",
          "preload": [],
          "type": "js",
        }
      `);
    expect(getFileInfos(indexCss, "_assets/index-aa7c8190.css", { sriAlgorithm: false } as VitePluginSymfonyOptions))
      .toMatchInlineSnapshot(`
        {
          "css": [
            "assets/index-aa7c8190.css",
          ],
          "hash": null,
          "inputRelPath": "_assets/index-aa7c8190.css",
          "outputRelPath": "assets/index-aa7c8190.css",
          "type": "css",
        }
      `);
    expect(getFileInfos(themeCss, "assets/theme.scss", { sriAlgorithm: false } as VitePluginSymfonyOptions))
      .toMatchInlineSnapshot(`
        {
          "css": [
            "assets/theme-44b5be96.css",
          ],
          "hash": null,
          "inputRelPath": "assets/theme.scss",
          "outputRelPath": "assets/theme-44b5be96.css",
          "type": "css",
        }
      `);
    expect(getFileInfos(logoPng, "_assets/logo-d015cc3f.png", { sriAlgorithm: false } as VitePluginSymfonyOptions))
      .toMatchInlineSnapshot(`
        {
          "hash": null,
          "inputRelPath": "_assets/logo-d015cc3f.png",
          "outputRelPath": "assets/logo-d015cc3f.png",
          "type": "asset",
        }
      `);
    expect(getFileInfos(welcomeJs, "assets/page/welcome/index.js", { sriAlgorithm: false } as VitePluginSymfonyOptions))
      .toMatchInlineSnapshot(`
        {
          "assets": [],
          "css": [],
          "dynamic": [],
          "hash": null,
          "imports": [],
          "inputRelPath": "assets/page/welcome/index.js",
          "js": [
            "assets/welcome-1e67239d.js",
          ],
          "outputRelPath": "assets/welcome-1e67239d.js",
          "preload": [],
          "type": "js",
        }
      `);
    expect(
      getFileInfos(welcomeJs, "assets/page/welcome/index.js", { sriAlgorithm: "sha256" } as VitePluginSymfonyOptions),
    ).toMatchInlineSnapshot(`
      {
        "assets": [],
        "css": [],
        "dynamic": [],
        "hash": "sha256-w+Sit18/MC+LC1iX8MrNapOiCQ8wbPX8Rb6ErbfDX1Q=",
        "imports": [],
        "inputRelPath": "assets/page/welcome/index.js",
        "js": [
          "assets/welcome-1e67239d.js",
        ],
        "outputRelPath": "assets/welcome-1e67239d.js",
        "preload": [],
        "type": "js",
      }
    `);
    expect(getFileInfos(pageAssets, "assets/page/assets/index.js", { sriAlgorithm: false } as VitePluginSymfonyOptions))
      .toMatchInlineSnapshot(`
        {
          "assets": [
            "assets/logo-d015cc3f.png",
          ],
          "css": [
            "assets/index-aa7c8190.css",
          ],
          "dynamic": [],
          "hash": null,
          "imports": [],
          "inputRelPath": "assets/page/assets/index.js",
          "js": [
            "assets/pageAssets-05cfe79c.js",
          ],
          "outputRelPath": "assets/pageAssets-05cfe79c.js",
          "preload": [],
          "type": "js",
        }
      `);
    expect(
      getFileInfos(welcomeLegacyJs, "assets/page/welcome/index-legacy.js", {
        sriAlgorithm: false,
      } as VitePluginSymfonyOptions),
    ).toMatchInlineSnapshot(`
      {
        "assets": [],
        "css": [],
        "dynamic": [],
        "hash": null,
        "imports": [],
        "inputRelPath": "assets/page/welcome/index-legacy.js",
        "js": [
          "assets/welcome-legacy-64979d13.js",
        ],
        "outputRelPath": "assets/welcome-legacy-64979d13.js",
        "preload": [],
        "type": "js",
      }
    `);
    expect(getFileInfos(legacyPolyfills, "vite/legacy-polyfills", { sriAlgorithm: false } as VitePluginSymfonyOptions))
      .toMatchInlineSnapshot(`
        {
          "assets": [],
          "css": [],
          "dynamic": [],
          "hash": null,
          "imports": [],
          "inputRelPath": "vite/legacy-polyfills",
          "js": [
            "assets/polyfills-legacy-40963d34.js",
          ],
          "outputRelPath": "assets/polyfills-legacy-40963d34.js",
          "preload": [],
          "type": "js",
        }
      `);
  });
});

describe("prepareRollupInputs", () => {
  it("prepare inputs", ({ expect }) => {
    expect(
      prepareRollupInputs({
        ...viteBaseConfig,
        build: {
          rollupOptions: {
            input: {
              app: "./path/to/filename.ts",
              theme: "./other/place/to/theme.scss",
            },
          },
        },
      } as unknown as ResolvedConfig),
    ).toMatchInlineSnapshot(`
      {
        "app": {
          "inputRelPath": "path/to/filename.ts",
          "inputType": "js",
        },
        "theme": {
          "inputRelPath": "other/place/to/theme.scss",
          "inputType": "css",
        },
      }
    `);
  });
});

describe("getInputRelPath", () => {
  it("generate Correct path", ({ expect }) => {
    expect(
      getInputRelPath(
        {
          type: "asset",
          fileName: "theme.css",
        } as OutputAsset,
        { format: "es" } as NormalizedOutputOptions,
        viteBaseConfig,
      ),
    ).toBe("_theme.css");

    expect(
      getInputRelPath(
        {
          type: "chunk",
          facadeModuleId: "/home/me/project-dir/assets/page/welcome/index.js",
          name: "welcome",
        } as OutputChunk,
        { format: "es" } as NormalizedOutputOptions,
        viteBaseConfig,
      ),
    ).toBe("assets/page/welcome/index.js");

    expect(
      getInputRelPath(
        {
          type: "chunk",
          facadeModuleId: "/home/me/project-dir/assets/page/welcome/index.js",
          name: "welcome",
        } as OutputChunk,
        { format: "system" } as NormalizedOutputOptions,
        viteBaseConfig,
      ),
    ).toBe("assets/page/welcome/index-legacy.js");
  });
});

describe("isAncestorDir", () => {
  it("subdirectory is a subdirectory", ({ expect }) => {
    expect(isSubdirectory("/projects/vite-project", "/projects/vite-project/public")).toBe(true);
  });
  it("same folder is not a subdirectory", ({ expect }) => {
    expect(isSubdirectory("/projects/vite-project", "/projects/vite-project")).toBe(false);
  });
  it("sibling folder is not a subdirectory", ({ expect }) => {
    expect(isSubdirectory("/projects/vite-project", "/projects/symfony-project")).toBe(false);
  });
  it("sibling folder starting with same name is not a subdirectory", ({ expect }) => {
    expect(isSubdirectory("/projects/vite-project", "/projects/vite-project-2")).toBe(false);
  });
  it("traversing up the tree and into a sibling folder is not a subdirectory", ({ expect }) => {
    expect(isSubdirectory("/projects/vite-project", "/projects/vite-project/../react-project")).toBe(false);
  });
  it("unnormalized path in project folder: is a subdirectory", ({ expect }) => {
    expect(isSubdirectory("/projects/vite-project", "/projects/vite-project/./public")).toBe(true);
  });
  it("unnormalized path with path traversal into subdirectory is a subdirectory", ({ expect }) => {
    expect(isSubdirectory("/vite-project/../projects", "/projects/vite-project")).toBe(true);
  });
  it("unnormalized path relative to current directory: is not a subdirectory", ({ expect }) => {
    expect(isSubdirectory("/projects/vite-project", "./vite-project")).toBe(false);
  });
});
