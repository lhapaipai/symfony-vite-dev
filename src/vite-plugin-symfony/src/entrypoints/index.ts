import { resolve, join, relative, dirname } from "node:path";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import glob from "fast-glob";
import process from "node:process";

import { Logger, Plugin, UserConfig } from "vite";
import sirv from "sirv";

import colors from "picocolors";

import type { RenderedChunk, OutputAsset, NormalizedOutputOptions, OutputChunk } from "rollup";

import { getDevEntryPoints, getBuildEntryPoints, getFilesMetadatas } from "./entryPointsHelper";
import {
  normalizePath,
  writeJson,
  emptyDir,
  isImportRequest,
  isInternalRequest,
  resolveDevServerUrl,
  isAddressInfo,
  isCssEntryPoint,
  getFileInfos,
  getInputRelPath,
  parseVersionString,
  isSubdirectory,
} from "./utils";
import { resolveBase, resolveOutDir, refreshPaths, resolvePublicDir } from "../pluginOptions";

import {
  StringMapping,
  GeneratedFiles,
  ResolvedConfigWithOrderablePlugins,
  VitePluginSymfonyEntrypointsOptions,
} from "../types";

// src and dist directory are in the same level;
let pluginDir = dirname(dirname(fileURLToPath(import.meta.url)));
let pluginVersion;

if (process.env.VITEST) {
  pluginDir = dirname(pluginDir);
  pluginVersion = ["test"];
} else {
  const packageJson = JSON.parse(readFileSync(join(pluginDir, "package.json")).toString());
  pluginVersion = parseVersionString(packageJson?.version);
}

export default function symfonyEntrypoints(pluginOptions: VitePluginSymfonyEntrypointsOptions, logger: Logger): Plugin {
  let viteConfig: ResolvedConfigWithOrderablePlugins;
  let viteDevServerUrl: string;

  const entryPointsFileName = ".vite/entrypoints.json";

  const inputRelPath2outputRelPath: StringMapping = {};
  const generatedFiles: GeneratedFiles = {};

  let outputCount = 0;

  return {
    name: "symfony-entrypoints",
    enforce: "post",
    config(userConfig) {
      const root = userConfig.root ? resolve(userConfig.root) : process.cwd();

      if (userConfig.build.rollupOptions.input instanceof Array) {
        logger.error(colors.red("rollupOptions.input must be an Objet like {app: './assets/app.js'}"), {
          timestamp: true,
        });
        process.exit(1);
      }

      const extraConfig: UserConfig = {
        base: userConfig.base ?? resolveBase(pluginOptions),
        publicDir: false,
        build: {
          manifest: true,
          outDir: userConfig.build?.outDir ?? resolveOutDir(pluginOptions),
        },
        optimizeDeps: {
          //Set to true to force dependency pre-bundling.
          force: true,
        },
        server: {
          watch: {
            ignored: userConfig.server?.watch?.ignored
              ? []
              : ["**/vendor/**", glob.escapePath(root + "/var") + "/**", glob.escapePath(root + "/public") + "/**"],
          },
        },
      };

      return extraConfig;
    },
    configResolved(config) {
      viteConfig = config as ResolvedConfigWithOrderablePlugins;

      if (pluginOptions.enforcePluginOrderingPosition) {
        const pluginPos = viteConfig.plugins.findIndex((plugin) => plugin.name === "symfony");
        const symfonyPlugin = viteConfig.plugins.splice(pluginPos, 1);

        const manifestPos = viteConfig.plugins.findIndex((plugin) => plugin.name === "vite:reporter");
        viteConfig.plugins.splice(manifestPos, 0, symfonyPlugin[0]);
      }
    },
    configureServer(devServer) {
      // vite server is running

      const { watcher, ws } = devServer;
      // empty the buildDir and create an entrypoints.json file inside.
      devServer.httpServer?.once("listening", () => {
        if (viteConfig.env.DEV) {
          if (typeof pluginOptions.buildDirectory !== "undefined") {
            logger.error(
              `"buildDirectory" plugin option is deprecated and will be removed in v5.x use base: "${resolveBase(
                pluginOptions,
              )}" from vite config instead`,
              {
                timestamp: true,
              },
            );
          }
          if (typeof pluginOptions.publicDirectory !== "undefined") {
            logger.error(
              `${colors.red(
                "[vite-plugin-symfony]",
              )} "publicDirectory" plugin option is deprecated and will be removed in v5.x use build.outDir: "${resolveOutDir(
                pluginOptions,
              )}" from vite config instead`,
              {
                timestamp: true,
              },
            );
          }
          if (pluginOptions.viteDevServerHostname !== null) {
            logger.error(
              `${colors.red(
                "[vite-plugin-symfony]",
              )} "viteDevServerHostname" plugin option is deprecated and will be removed in v5.x use originOverride with protocol and port instead`,
              {
                timestamp: true,
              },
            );
          }

          const buildDir = resolve(viteConfig.root, viteConfig.build.outDir);
          const viteDir = resolve(buildDir, ".vite");

          // buildDir is not a subdirectory of the vite project root -> potentially dangerous
          if (!isSubdirectory(viteConfig.root, buildDir) && viteConfig.build.emptyOutDir !== true) {
            logger.error(
              `outDir ${buildDir} is not a subDirectory of your project root. To prevent recursively deleting files anywhere else set "build.outDir" to true in your vite.config.js to confirm that you did not accidentally specify a wrong directory location.`,
              {
                timestamp: true,
              },
            );
            process.exit(1);
          }

          if (!existsSync(buildDir)) {
            mkdirSync(buildDir, { recursive: true });
          }

          existsSync(buildDir) && emptyDir(buildDir);

          mkdirSync(viteDir, { recursive: true });

          const address = devServer.httpServer?.address();

          if (!isAddressInfo(address)) {
            logger.error(
              `address is not an object open an issue with your address value to fix the problem : ${address}`,
              {
                timestamp: true,
              },
            );
            process.exit(1);
          }

          viteDevServerUrl = resolveDevServerUrl(address, devServer.config, pluginOptions);
          if (pluginOptions.enforceServerOriginAfterListening) {
            viteConfig.server.origin = viteDevServerUrl;
          }

          const entryPoints = getDevEntryPoints(viteConfig, viteDevServerUrl);

          const entryPointsPath = resolve(viteConfig.root, viteConfig.build.outDir, entryPointsFileName);

          writeJson(entryPointsPath, {
            base: viteConfig.base,
            entryPoints,
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

      if (pluginOptions.servePublic !== false) {
        // inspired by https://github.com/vitejs/vite
        // file: packages/vite/src/node/server/middlewares/static.ts
        const serve = sirv(resolvePublicDir(pluginOptions), {
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
          if (req.url === "/" || req.url === "/build/") {
            res.statusCode = 404;
            res.end(readFileSync(join(pluginDir, "static/dev-server-404.html")));
            return;
          }

          // skip import request and internal requests `/@fs/ /@vite-client` etc...
          if (isImportRequest(req.url!) || isInternalRequest(req.url!)) {
            return next();
          }
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

      // chunk.viteMetadata.importedCss contains a Set of relative file paths of css files
      // in our case we have only one file.
      // eg: inputRelPath2outputRelPath['assets/theme.scss'] = 'assets/theme-44b5be96.css';
      chunk.viteMetadata.importedCss.forEach((cssBuildFilename) => {
        inputRelPath2outputRelPath[cssAssetName] = cssBuildFilename;
      });
    },
    generateBundle(options: NormalizedOutputOptions, bundle: { [fileName: string]: OutputAsset | OutputChunk }) {
      for (const chunk of Object.values(bundle)) {
        const inputRelPath = getInputRelPath(chunk, options, viteConfig);
        inputRelPath2outputRelPath[inputRelPath] = chunk.fileName;
        generatedFiles[chunk.fileName] = getFileInfos(chunk, inputRelPath, pluginOptions);
      }

      outputCount++;
      const output = viteConfig.build.rollupOptions?.output;

      // if we have multiple build passes output is an array of each pass.
      // else we have an object of this unique pass
      const outputLength = Array.isArray(output) ? output.length : 1;

      if (outputCount >= outputLength) {
        const entryPoints = getBuildEntryPoints(generatedFiles, viteConfig, inputRelPath2outputRelPath);

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
  };
}
