import { VitePluginSymfonyFosRoutingOptions } from "~/types";
import { deepMerge, objectToArg } from "~/fos-routing/utils";
import { normalizePath } from "vite-plugin-symfony/src/entrypoints/utils.ts";
import { Logger, ViteDevServer } from "vite";
import { execFileSync } from "node:child_process";
import * as path from "node:path";
import process from "node:process";
import fs from "node:fs";

/**
 * Vite plugin to generate fos routes and inject them into the code.
 * Adapted from the original Webpack plugin made by FOS.
 * @author Tudorache Leonard Valentin <tudorache.leonard@wyverr.com>
 * @param pluginOptions
 * @param logger
 */
export default function symfonyFosRouting(pluginOptions?: VitePluginSymfonyFosRoutingOptions, logger?: Logger) {
  let routesChanged = true; // Control when to inject
  let prevContent = null; // Previous content of the routes
  const entryModules = new Set();
  /**
   * Default plugin options.
   */
  const defaultPluginOptions = {
    args: {
      target: "var/cache/fosRoutes.json",
      format: "json",
      locale: "",
      prettyPrint: false,
      domain: [],
      extraArgs: {},
    },
    addImportByDefault: true,
    routingPluginPackageName: "fos-router",
    watchPaths: ["src/**/*.php"],
    possibleRoutesConfigFilesExt: ["php"],
    verbose: false,
    php: "php",
  };

  /**
   * Merges the default options with the user options.
   */
  const finalPluginOptions: VitePluginSymfonyFosRoutingOptions =
    pluginOptions === true ? defaultPluginOptions : deepMerge(defaultPluginOptions, pluginOptions);

  /**
   * Resolves the target path.
   */
  const finalTarget = path.resolve(process.cwd(), finalPluginOptions.args.target);

  /**
   * Resolve the target path to a temporary file.
   */
  finalPluginOptions.args.target = path.resolve(
    process.cwd(),
    finalPluginOptions.args.target.replace(/\.json$/, ".tmp.json"),
  );

  /**
   * Prevents the target from being the same as the final target.
   */
  if (finalPluginOptions.args.target === finalTarget) {
    finalPluginOptions.args.target += ".tmp";
  }

  /**
   * Target shortcut.
   */
  const target = finalPluginOptions.args.target;

  function runDumpRoutesCmdSync() {
    if (finalPluginOptions.verbose) {
      logger.warn("Generating fos routes...");
    }
    const args = objectToArg(finalPluginOptions.args);

    // Dump routes
    execFileSync(finalPluginOptions.php, ["bin/console", "fos:js-routing:dump", ...args], {
      stdio: finalPluginOptions.verbose ? "inherit" : undefined,
    });
  }

  return {
    name: "rollup-plugin-symfony-fos-routing",

    /**
     * Runs the command on build start.
     */
    buildStart(inputOptions) {
      /**
       * Add the entry modules to the set.
       * Alternative to this.getModuleInfo(id).isEntry because we get "
       * The "isEntry" property of ModuleInfo is not supported." when using it in transform function.
       */
      Object.values(inputOptions.input).forEach((input) => entryModules.add(normalizePath(input)));

      /**
       * Runs the command to generate the fos routes.
       * Also checks if the routes have changed and saves them to a file.
       * Then sets routesChanged to true if the routes have changed.
       */
      try {
        runDumpRoutesCmdSync();

        const content = fs.readFileSync(target);
        if (fs.existsSync(target)) {
          fs.rmSync(target); // Remove the temporary file
        }
        // Check if there are new routes
        if (!prevContent || content.compare(prevContent) !== 0) {
          fs.mkdirSync(path.dirname(finalTarget), { recursive: true });
          fs.writeFileSync(finalTarget, content);

          prevContent = content;
          routesChanged = true;
        }
      } catch (err) {
        logger.error(err.toString());
      }
    },

    /**
     * Configures the server to watch for changes.
     * When a change is detected, the routes are dumped and the code is reloaded if the routes file content is changed.
     */
    configureServer(devServer: ViteDevServer) {
      const { watcher, ws } = devServer;
      const paths = [...finalPluginOptions.watchPaths, target];
      for (const path of paths) {
        watcher.add(path);
      }
      watcher.on("change", function (path) {
        if (path === target) return;
        /**
         * Dump the routes if a possible routes config file is changed.
         */
        finalPluginOptions.possibleRoutesConfigFilesExt.forEach((ext) => {
          if (path.endsWith(`.${ext}`)) {
            runDumpRoutesCmdSync();
          }
        });
        /**
         * Reload the page if the routes file content is changed.
         */
        if (target === path) {
          if (finalPluginOptions.verbose) {
            logger.warn("We detected a change in the routes file. Reloading...");
          }
          ws.send({
            type: "full-reload",
          });
        } else if (finalPluginOptions.verbose) {
          logger.warn("No change in the routes file.");
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
        if (finalPluginOptions.verbose) {
          logger.warn(`Injecting routes in ${id}...`);
        }
        const routingPluginPackageName = finalPluginOptions.routingPluginPackageName;

        // Create the regex pattern dynamically
        const pattern = `import\\s+\\w+\\s+from\\s+(?:"${routingPluginPackageName}"|'${routingPluginPackageName}')\\s*;?`;
        // Create the RegExp object
        const importRegex = new RegExp(pattern, "g");
        const replaceText = `
import Routing from "${finalPluginOptions.routingPluginPackageName}";
import routes from ${JSON.stringify(finalTarget)};
Routing.setRoutingData(routes); \n
        `;

        /**
         * Inject the routes into the code if the code does not contain the routing plugin import.
         */
        if (!code.match(pattern) && finalPluginOptions.addImportByDefault) {
          return {
            code: replaceText + code,
            map: null,
          };
        }

        return {
          code: code.replace(importRegex, replaceText),
          map: null,
        };
      }

      return {
        code,
        map: null,
      };
    },
  };
}
