import path, { resolve, join, relative, dirname } from "node:path";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import glob from "fast-glob";
import process from "node:process";

import { Logger, Plugin, UserConfig } from "vite";
import sirv from "sirv";

import colors from "picocolors";

import type { RenderedChunk, NormalizedOutputOptions, OutputBundle } from "rollup";

import { getDevEntryPoints, getBuildEntryPoints, getFilesMetadatas } from "./entryPointsHelper";
import {
  normalizePath,
  writeJson,
  isImportRequest,
  isInternalRequest,
  resolveDevServerUrl,
  isAddressInfo,
  isCssEntryPoint,
  getFileInfos,
  getInputRelPath,
  parseVersionString,
  extractExtraEnvVars,
  INFO_PUBLIC_PATH,
  normalizeConfig,
} from "./utils";
import { resolveOutDir, refreshPaths } from "./pluginOptions";

import { GeneratedFiles, ResolvedConfigWithOrderablePlugins, VitePluginSymfonyEntrypointsOptions } from "../types";
import { addIOMapping } from "./pathMapping";
import { showDepreciationsWarnings } from "./depreciations";

// src and dist directory are in the same level;
let pluginDir = dirname(dirname(fileURLToPath(import.meta.url)));
let pluginVersion: [string] | [string, number, number, number];
let bundleVersion: [string] | [string, number, number, number];

if (process.env.VITEST) {
  pluginDir = dirname(pluginDir);
  pluginVersion = ["test"];
  bundleVersion = ["test"];
} else {
  try {
    const packageJson = JSON.parse(readFileSync(join(pluginDir, "package.json")).toString());
    pluginVersion = parseVersionString(packageJson?.version);
  } catch {
    pluginVersion = [""];
  }
  try {
    const composerJson = JSON.parse(readFileSync("composer.lock").toString());
    bundleVersion = parseVersionString(
      composerJson.packages?.find(
        (composerPackage: { name: string }) => composerPackage.name === "pentatrion/vite-bundle",
      )?.version,
    );
  } catch {
    bundleVersion = [""];
  }
}

export default function symfonyEntrypoints(pluginOptions: VitePluginSymfonyEntrypointsOptions, logger: Logger) {
  let viteConfig: ResolvedConfigWithOrderablePlugins;
  let viteDevServerUrl: string;

  const entryPointsFileName = ".vite/entrypoints.json";

  const generatedFiles: GeneratedFiles = {};

  let outputCount = 0;

  return {
    name: "symfony-entrypoints",
    enforce: "post",
    config(userConfig, { mode }) {
      const root = userConfig.root ? resolve(userConfig.root) : process.cwd();

      const envDir = userConfig.envDir ? resolve(root, userConfig.envDir) : root;

      const extraEnvVars = extractExtraEnvVars(mode, envDir, pluginOptions.exposedEnvVars, userConfig.define);

      if (userConfig.build?.rollupOptions?.input instanceof Array) {
        logger.error(colors.red("rollupOptions.input must be an Objet like {app: './assets/app.js'}"));
        process.exit(1);
      }

      const base = userConfig.base ?? "/build/";

      const extraConfig: UserConfig = {
        base,
        publicDir: false,
        build: {
          manifest: true,
          outDir: userConfig.build?.outDir ?? resolveOutDir(base),
        },
        define: extraEnvVars,
        optimizeDeps: {
          //Set to true to force dependency pre-bundling.
          force: true,
        },
        server: {
          watch: {
            ignored: userConfig.server?.watch?.ignored
              ? userConfig.server.watch.ignored
              : ["**/vendor/**", glob.escapePath(root + "/var") + "/**", glob.escapePath(root + "/public") + "/**"],
          },
        },
      };

      return extraConfig;
    },
    configResolved(config) {
      viteConfig = config as ResolvedConfigWithOrderablePlugins;

      if (pluginOptions.enforcePluginOrderingPosition) {
        const pluginPos = viteConfig.plugins.findIndex((plugin) => plugin.name === "symfony-entrypoints");
        const symfonyPlugin = viteConfig.plugins.splice(pluginPos, 1);

        const manifestPos = viteConfig.plugins.findIndex((plugin) => plugin.name === "vite:reporter");
        viteConfig.plugins.splice(manifestPos, 0, symfonyPlugin[0]);
      }
    },
    configureServer(devServer) {
      // vite server is running
      const { watcher, ws } = devServer;

      const _printUrls = devServer.printUrls;
      devServer.printUrls = () => {
        _printUrls();
        const versions: string[] = [];
        if (pluginVersion[0]) {
          versions.push(colors.dim(`vite-plugin-symfony: `) + colors.bold(`v${pluginVersion[0]}`));
        }
        if (bundleVersion[0]) {
          versions.push(colors.dim(`pentatrion/vite-bundle: `) + colors.bold(`${bundleVersion[0]}`));
        }
        const versionStr = versions.length === 0 ? "" : versions.join(colors.dim(", "));
        console.log(`  ${colors.green("➜")}  Vite ${colors.yellow("⚡️")} Symfony: ${versionStr}`);
      };

      devServer.httpServer?.once("listening", () => {
        // empty the buildDir and create an entrypoints.json file inside.
        if (viteConfig.env.DEV && !process.env.VITEST) {
          showDepreciationsWarnings(pluginOptions, logger);

          const buildDir = resolve(viteConfig.root, viteConfig.build.outDir);
          const viteDir = resolve(buildDir, ".vite");
          const address = devServer.httpServer?.address();
          const entryPointsPath = resolve(viteConfig.root, viteConfig.build.outDir, entryPointsFileName);

          if (!isAddressInfo(address)) {
            logger.error(
              `address is not an object open an issue with your address value to fix the problem : ${address}`,
            );
            process.exit(1);
          }

          if (!existsSync(buildDir)) {
            mkdirSync(buildDir, { recursive: true });
          }

          mkdirSync(viteDir, { recursive: true });

          viteDevServerUrl = resolveDevServerUrl(address, devServer.config, pluginOptions);
          if (pluginOptions.enforceServerOriginAfterListening) {
            viteConfig.server.origin = viteDevServerUrl;
          }

          writeJson(entryPointsPath, {
            base: viteConfig.base,
            entryPoints: getDevEntryPoints(viteConfig, viteDevServerUrl),
            legacy: false,
            metadatas: {},
            version: pluginVersion,
            viteServer: viteDevServerUrl,
          });
        }
      });

      // full reload vite dev server if twig files are modified.
      if (pluginOptions.refresh !== false) {
        const paths = pluginOptions.refresh === true ? refreshPaths : pluginOptions.refresh;
        for (const path of paths) {
          watcher.add(path);
        }
        watcher.on("change", function (path) {
          if (path.endsWith(".twig")) {
            ws.send({
              type: "full-reload",
            });
          }
        });
      }

      devServer.middlewares.use(function symfonyInternalsMiddleware(req, res, next) {
        if (req.url === "/" || req.url === viteConfig.base) {
          res.statusCode = 404;
          res.end(readFileSync(join(pluginDir, "static/dev-server-404.html")));
          return;
        }

        if (req.url === path.posix.join(viteConfig.base, INFO_PUBLIC_PATH)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");

          res.end(normalizeConfig(viteConfig));
          return;
        }

        return next();
      });

      // inspired by https://github.com/vitejs/vite
      // file: packages/vite/src/node/server/middlewares/static.ts
      if (pluginOptions.servePublic !== false) {
        const serve = sirv(pluginOptions.servePublic, {
          dev: true,
          etag: true,
          extensions: [],
          setHeaders(res, pathname) {
            // Matches js, jsx, ts, tsx.
            // The reason this is done, is that the .ts file extension is reserved
            // for the MIME type video/mp2t. In almost all cases, we can expect
            // these files to be TypeScript files, and for Vite to serve them with
            // this Content-Type.
            if (/\.[tj]sx?$/.test(pathname)) {
              res.setHeader("Content-Type", "application/javascript");
            }

            res.setHeader("Access-Control-Allow-Origin", "*");
          },
        });

        devServer.middlewares.use(function viteServePublicMiddleware(req, res, next) {
          // skip import request and internal requests `/@fs/ /@vite-client` etc...
          if (isImportRequest(req.url!) || isInternalRequest(req.url!)) {
            return next();
          }

          // only if servePublic is enabled
          serve(req, res, next);
        });
      }
    },
    async renderChunk(code: string, chunk: RenderedChunk) {
      // we need this step because css entrypoints doesn't have a facadeModuleId in `generateBundle` step.
      if (!isCssEntryPoint(chunk)) {
        return;
      }

      // Here we have only css entryPoints
      const cssAssetName = chunk.facadeModuleId
        ? normalizePath(relative(viteConfig.root, chunk.facadeModuleId))
        : chunk.name;

      // chunk.viteMetadata.importedCss contains a Set of relative paths of generated css files
      // in our case we have only one file (it's a condition of isCssEntryPoint to be true).
      // eg: addIOMapping('assets/theme.scss', 'assets/theme-44b5be96.css');
      chunk.viteMetadata?.importedCss.forEach((cssBuildFilename) => {
        addIOMapping(cssAssetName, cssBuildFilename);
      });
    },
    generateBundle(options: NormalizedOutputOptions, bundle: OutputBundle) {
      for (const chunk of Object.values(bundle)) {
        const inputRelPath = getInputRelPath(chunk, options, viteConfig);
        addIOMapping(inputRelPath, chunk.fileName);
        generatedFiles[chunk.fileName] = getFileInfos(chunk, inputRelPath, pluginOptions);
      }

      outputCount++;
      const output = viteConfig.build.rollupOptions?.output;

      // if we have multiple build passes output is an array of each pass.
      // else we have an object of this unique pass
      const outputLength = Array.isArray(output) ? output.length : 1;

      if (outputCount >= outputLength) {
        const entryPoints = getBuildEntryPoints(generatedFiles, viteConfig);

        this.emitFile({
          fileName: entryPointsFileName,
          source: JSON.stringify(
            {
              base: viteConfig.base,
              entryPoints,
              legacy: typeof entryPoints["polyfills-legacy"] !== "undefined",
              metadatas: getFilesMetadatas(viteConfig.base, generatedFiles),
              version: pluginVersion,
              viteServer: null,
            },
            null,
            2,
          ),
          type: "asset",
        });
      }
    },
  } satisfies Plugin;
}
