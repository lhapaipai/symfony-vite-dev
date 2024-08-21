import { VitePluginSymfonyFosRoutingOptions } from "~/types";
import { getImportRE, objectToArg } from "~/fos-routing/utils";
import { normalizePath } from "~/entrypoints/utils";
import { Logger, Plugin, ResolvedConfig, ViteDevServer } from "vite";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import micromatch from "micromatch";

/**
 * Vite plugin to generate fos routes and inject them into the code.
 * Adapted from the original Webpack plugin made by FOS.
 * @author Tudorache Leonard Valentin <tudorache.leonard@wyverr.com>
 * @param pluginOptions
 * @param logger
 */
export default function symfonyFosRouting(pluginOptions: VitePluginSymfonyFosRoutingOptions, logger: Logger): Plugin {
  let viteConfig: ResolvedConfig;

  let routesChanged = true; // Control when to inject
  let prevContent: Buffer | null = null; // Previous content of the routes
  const entryModules = new Set();

  /**
   * Resolves the target path.
   */
  let target: string;

  function runDumpRoutesCmdSync() {
    if (pluginOptions.verbose) {
      logger.info("Generating fos routes...");
    }
    const args = objectToArg(pluginOptions.args);

    // Dump routes
    execFileSync(pluginOptions.php, ["bin/console", "fos:js-routing:dump", ...args], {
      stdio: pluginOptions.verbose ? "inherit" : undefined,
    });
  }

  return {
    name: "rollup-plugin-symfony-fos-routing",
    configResolved(config) {
      viteConfig = config;
      target = resolve(config.root, pluginOptions.args.target);
    },
    /**
     * Runs the command on build start.
     */
    buildStart(inputOptions) {
      /**
       * Add the entry modules to the set.
       * Alternative to this.getModuleInfo(id).isEntry because we get "
       * The "isEntry" property of ModuleInfo is not supported." when using it in transform function.
       */
      Object.values(inputOptions.input).forEach((input) =>
        entryModules.add(normalizePath(resolve(viteConfig.root, input))),
      );

      /**
       * Runs the command to generate the fos routes.
       * Also checks if the routes have changed and saves them to a file.
       * Then sets routesChanged to true if the routes have changed.
       */
      try {
        runDumpRoutesCmdSync();

        const content = readFileSync(target);
        if (existsSync(target)) {
          rmSync(target); // Remove the temporary file
        }
        // Check if there are new routes
        if (!prevContent || content.compare(prevContent) !== 0) {
          mkdirSync(dirname(target), { recursive: true });
          writeFileSync(target, content);

          prevContent = content;
          routesChanged = true;
        } else {
          routesChanged = false;
        }
      } catch (err: any) {
        logger.error(err.toString());
      }
    },

    /**
     * Configures the server to watch for changes.
     * When a change is detected, the routes are dumped and the code is reloaded if the routes file content is changed.
     */
    configureServer(devServer: ViteDevServer) {
      const { watcher, ws } = devServer;
      watcher.add([...pluginOptions.watchPaths, target]);

      watcher.on("change", function (path) {
        // pluginOptions.possibleRoutesConfigFilesExt.forEach((ext) => {
        //   if (path.endsWith(`.${ext}`)) {
        //     runDumpRoutesCmdSync();
        //   }
        // });
        if (micromatch.isMatch(path, pluginOptions.watchPaths)) {
          /**
           * Dump the routes if a possible routes config file is changed.
           */
          runDumpRoutesCmdSync();
        } else if (target === path) {
          /**
           * Reload the page if the routes file content is changed.
           */
          if (pluginOptions.verbose) {
            logger.info("We detected a change in the routes file. Reloading...");
          }
          ws.send({
            type: "full-reload",
          });
        }
      });
    },

    /**
     * Injects the routes into the code.
     * @param code
     * @param id
     */
    async transform(code, id) {
      const isInputFile = entryModules.has(id);

      // Inject if shouldInject is true and the file is matched by the transformCheckFileTypes regex.
      if (isInputFile && routesChanged) {
        if (pluginOptions.verbose) {
          logger.info(`Injecting routes in ${id}...`);
        }
        const routingPluginPackageName = pluginOptions.routingPluginPackageName;

        const replaceText = `
import Routing from "${pluginOptions.routingPluginPackageName}";
import routes from ${JSON.stringify(target)};
Routing.setRoutingData(routes); \n
        `;

        // Create the regex pattern dynamically
        const importRE = getImportRE(routingPluginPackageName);
        const hasAnImport = importRE.test(code);

        /**
         * Inject the routes into the code if the code does not contain the routing plugin import.
         */
        if (!hasAnImport && pluginOptions.addImportByDefault) {
          return replaceText + code;
        }

        return code.replace(importRE, replaceText);
      }

      return null;
    },
  };
}
