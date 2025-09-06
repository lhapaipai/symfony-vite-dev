import { describe, it, vi } from "vitest";

import vitePluginSymfonyEntrypoints from "./index";
import type { OutputChunk, OutputAsset } from "rollup";

import {
  viteBaseConfig,
  asyncDepChunk,
  pageImports,
  indexCss,
  themeScssChunk,
  themeCss,
  welcomeJs,
  welcomeLegacyJs,
  legacyPolyfills,
  pageAssets,
  logoPng,
  circular1Js,
  circular2Js,
  viteUserConfigNoRoot,
  modernPolyfills,
} from "~tests/mocks";
import { VitePluginSymfonyEntrypointsOptions } from "~/types";
import { createLogger, Logger } from "vite";
import { resolvePluginEntrypointsOptions } from "./pluginOptions";

function createBundleObject(files: (OutputChunk | OutputAsset)[]) {
  const bundles: {
    [fileName: string]: OutputChunk | OutputAsset;
  } = {};
  files.forEach((file) => {
    bundles[file.fileName] = file;
  });

  return bundles;
}

function plugin(userPluginEntrypointsOptions: Partial<VitePluginSymfonyEntrypointsOptions>) {
  const entrypointsOptions = resolvePluginEntrypointsOptions(userPluginEntrypointsOptions);
  const logger: Logger = {
    ...createLogger(),
    info: vi.fn(),
  };
  return vitePluginSymfonyEntrypoints(entrypointsOptions, logger);
}

describe("vitePluginSymfonyEntrypoints", () => {
  it("generate correct welcome build entrypoints", ({ expect }) => {
    const welcomePluginInstance = plugin({ debug: true }) as any;

    welcomePluginInstance.emitFile = vi.fn();
    welcomePluginInstance.configResolved({
      ...viteBaseConfig,
      build: {
        rollupOptions: {
          input: {
            welcome: "./assets/page/welcome/index.js",
          },
        },
      },
    });
    const welcomeBundle = createBundleObject([welcomeJs]);
    welcomePluginInstance.generateBundle({ format: "es" }, welcomeBundle);

    expect(welcomePluginInstance.emitFile).toHaveBeenCalledWith({
      fileName: ".vite/entrypoints.json",
      source: JSON.stringify(
        {
          base: "/build/",
          entryPoints: {
            welcome: {
              css: [],
              dynamic: [],
              js: ["/build/assets/welcome-1e67239d.js"],
              legacy: false,
              preload: [],
            },
          },
          legacy: false,
          metadatas: {},
          version: ["test"],
          viteServer: null,
        },
        null,
        2,
      ),
      type: "asset",
    });
  });

  it("generate correct integrity hash for build entrypoints", ({ expect }) => {
    const hashPluginInstance = plugin({ debug: true, sriAlgorithm: "sha256" }) as any;

    hashPluginInstance.emitFile = vi.fn();
    hashPluginInstance.configResolved({
      ...viteBaseConfig,
      build: {
        rollupOptions: {
          input: {
            welcome: "./assets/page/welcome/index.js",
          },
        },
      },
    });
    hashPluginInstance.generateBundle({ format: "es" }, createBundleObject([welcomeJs]));

    expect(hashPluginInstance.emitFile).toHaveBeenCalledWith({
      fileName: ".vite/entrypoints.json",
      source: JSON.stringify(
        {
          base: "/build/",
          entryPoints: {
            welcome: {
              css: [],
              dynamic: [],
              js: ["/build/assets/welcome-1e67239d.js"],
              legacy: false,
              preload: [],
            },
          },
          legacy: false,
          metadatas: {
            "/build/assets/welcome-1e67239d.js": {
              hash: "sha256-w+Sit18/MC+LC1iX8MrNapOiCQ8wbPX8Rb6ErbfDX1Q=",
            },
          },
          version: ["test"],
          viteServer: null,
        },
        null,
        2,
      ),
      type: "asset",
    });
  });

  it("generate correct pageAssets build entrypoints", ({ expect }) => {
    const pageAssetsPluginInstance = plugin({ debug: true }) as any;
    pageAssetsPluginInstance.emitFile = vi.fn();
    pageAssetsPluginInstance.configResolved({
      ...viteBaseConfig,
      build: {
        rollupOptions: {
          input: {
            pageAssets: "./assets/page/assets/index.js",
          },
        },
      },
    });
    pageAssetsPluginInstance.generateBundle({ format: "es" }, createBundleObject([pageAssets, indexCss, logoPng]));

    expect(pageAssetsPluginInstance.emitFile).toHaveBeenCalledWith({
      fileName: ".vite/entrypoints.json",
      source: JSON.stringify(
        {
          base: "/build/",
          entryPoints: {
            pageAssets: {
              css: ["/build/assets/index-aa7c8190.css"],
              dynamic: [],
              js: ["/build/assets/pageAssets-05cfe79c.js"],
              legacy: false,
              preload: [],
            },
          },
          legacy: false,
          metadatas: {},
          version: ["test"],
          viteServer: null,
        },
        null,
        2,
      ),
      type: "asset",
    });
  });

  it("generate correct pageImports build entrypoints", ({ expect }) => {
    const pageImportsPluginInstance = plugin({ debug: true }) as any;
    pageImportsPluginInstance.emitFile = vi.fn();
    pageImportsPluginInstance.configResolved({
      ...viteBaseConfig,
      build: {
        rollupOptions: {
          input: {
            pageImports: "./assets/page/imports/index.js",
          },
        },
      },
    });
    pageImportsPluginInstance.generateBundle({ format: "es" }, createBundleObject([pageImports, asyncDepChunk]));

    expect(pageImportsPluginInstance.emitFile).toHaveBeenCalledWith({
      fileName: ".vite/entrypoints.json",
      source: JSON.stringify(
        {
          base: "/build/",
          entryPoints: {
            pageImports: {
              css: [],
              dynamic: ["/build/assets/async-dep-e2ac9f96.js"],
              js: ["/build/assets/pageImports-53eb9fd1.js"],
              legacy: false,
              preload: [],
            },
          },
          legacy: false,
          metadatas: {},
          version: ["test"],
          viteServer: null,
        },
        null,
        2,
      ),
      type: "asset",
    });
  });

  it("generate correct theme build entrypoints", ({ expect }) => {
    const themePluginInstance = plugin({ debug: true }) as any;
    themePluginInstance.emitFile = vi.fn();
    themePluginInstance.configResolved({
      ...viteBaseConfig,
      build: {
        rollupOptions: {
          input: {
            theme: "./assets/theme.scss",
          },
        },
      },
    });

    themePluginInstance.renderChunk("CODE", themeScssChunk);
    themePluginInstance.generateBundle({ format: "es" }, createBundleObject([themeCss]));

    expect(themePluginInstance.emitFile).toHaveBeenCalledWith({
      fileName: ".vite/entrypoints.json",
      source: JSON.stringify(
        {
          base: "/build/",
          entryPoints: {
            theme: {
              css: ["/build/assets/theme-44b5be96.css"],
              dynamic: [],
              js: [],
              legacy: false,
              preload: [],
            },
          },
          legacy: false,
          metadatas: {},
          version: ["test"],
          viteServer: null,
        },
        null,
        2,
      ),
      type: "asset",
    });
  });

  it("generate correct circular build entrypoints", ({ expect }) => {
    const circularPluginInstance = plugin({ debug: true }) as any;
    circularPluginInstance.emitFile = vi.fn();
    circularPluginInstance.configResolved({
      ...viteBaseConfig,
      build: {
        rollupOptions: {
          input: {
            circular: "./assets/page/circular1.js",
          },
        },
      },
    });

    circularPluginInstance.generateBundle({ format: "es" }, createBundleObject([circular1Js, circular2Js]));

    expect(circularPluginInstance.emitFile).toHaveBeenCalledWith({
      fileName: ".vite/entrypoints.json",
      source: JSON.stringify(
        {
          base: "/build/",
          entryPoints: {
            circular: {
              css: [],
              dynamic: [],
              js: ["/build/assets/circular1-56785678.js"],
              legacy: false,
              preload: ["/build/assets/circular2-12341234.js"],
            },
          },
          legacy: false,
          metadatas: {},
          version: ["test"],
          viteServer: null,
        },
        null,
        2,
      ),
      type: "asset",
    });
  });

  it("generate correct legacy build entrypoints", ({ expect }) => {
    const legacyPluginInstance = plugin({ debug: true }) as any;
    legacyPluginInstance.emitFile = vi.fn();
    legacyPluginInstance.configResolved({
      ...viteBaseConfig,
      build: {
        rollupOptions: {
          input: {
            welcome: "./assets/page/welcome/index.js",
          },
          output: [{ format: "system" }, { format: "es" }],
        },
      },
    });

    legacyPluginInstance.generateBundle({ format: "system" }, createBundleObject([welcomeLegacyJs, legacyPolyfills]));
    legacyPluginInstance.generateBundle({ format: "es" }, createBundleObject([welcomeJs]));

    expect(legacyPluginInstance.emitFile).toHaveBeenCalledWith({
      fileName: ".vite/entrypoints.json",
      source: JSON.stringify(
        {
          base: "/build/",
          entryPoints: {
            "welcome-legacy": {
              css: [],
              dynamic: [],
              js: ["/build/assets/welcome-legacy-64979d13.js"],
              legacy: false,
              preload: [],
            },
            welcome: {
              css: [],
              dynamic: [],
              js: ["/build/assets/welcome-1e67239d.js"],
              legacy: "welcome-legacy",
              preload: [],
            },
            "polyfills-legacy": {
              css: [],
              dynamic: [],
              js: ["/build/assets/polyfills-legacy-40963d34.js"],
              legacy: false,
              preload: [],
            },
          },
          legacy: true,
          metadatas: {},
          version: ["test"],
          viteServer: null,
        },
        null,
        2,
      ),
      type: "asset",
    });
  });

  it("generate correct legacy build entrypoints with modern polyfills", ({ expect }) => {
    const legacyPluginInstance = plugin({ debug: true }) as any;
    legacyPluginInstance.emitFile = vi.fn();
    legacyPluginInstance.configResolved({
      ...viteBaseConfig,
      build: {
        rollupOptions: {
          input: {
            welcome: "./assets/page/welcome/index.js",
          },
          output: [{ format: "system" }, { format: "es" }],
        },
      },
    });

    legacyPluginInstance.generateBundle({ format: "system" }, createBundleObject([welcomeLegacyJs, legacyPolyfills]));
    legacyPluginInstance.generateBundle({ format: "es" }, createBundleObject([welcomeJs, modernPolyfills]));

    expect(legacyPluginInstance.emitFile).toHaveBeenCalledWith({
      fileName: ".vite/entrypoints.json",
      source: JSON.stringify(
        {
          base: "/build/",
          entryPoints: {
            "welcome-legacy": {
              css: [],
              dynamic: [],
              js: ["/build/assets/welcome-legacy-64979d13.js"],
              legacy: false,
              preload: [],
            },
            welcome: {
              css: [],
              dynamic: [],
              js: ["/build/assets/welcome-1e67239d.js"],
              legacy: "welcome-legacy",
              preload: [],
            },
            "polyfills-legacy": {
              css: [],
              dynamic: [],
              js: ["/build/assets/polyfills-legacy-40963d34.js"],
              legacy: false,
              preload: [],
            },
            "polyfills": {
              css: [],
              dynamic: [],
              js: ["/build/assets/polyfills-Cj9hW7C2.js"],
              legacy: false,
              preload: [],
            },
          },
          legacy: true,
          metadatas: {},
          version: ["test"],
          viteServer: null,
        },
        null,
        2,
      ),
      type: "asset",
    });
  });

  it("loads correctly without root user config option", ({ expect }) => {
    const pluginInstance = plugin({ debug: true }) as any;
    const config = pluginInstance.config(viteUserConfigNoRoot, { mode: "development" });

    expect(config).toEqual({
      base: "/build/",
      publicDir: false,
      build: {
        manifest: true,
        outDir: "public/build",
      },
      define: {},
      optimizeDeps: {
        force: true,
      },
      server: {
        watch: {
          ignored: ["**/vendor/**", process.cwd() + "/var/**", process.cwd() + "/public/**"],
        },
      },
    });
  });
});
