import {VitePluginSymfonyFosRoutingOptions} from "~/types";
import {objectToArg} from "~/fos-routing/utils";
import {Logger} from 'vite'
import {execFileSync} from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";

/**
 * Vite plugin to generate fos routes and inject them into the code.
 * Adapted from the original Webpack plugin made by FOS.
 * @author Tudorache Leonard Valentin <tudorache.leonard@wyverr.com>
 * @param pluginOptions
 * @param logger
 */
export default function symfonyFosRouting(pluginOptions?: VitePluginSymfonyFosRoutingOptions, logger?: Logger) {
    let shouldInject = true; // Control when to inject
    let prevContent = null; // Previous content of the routes

    /**
     * Default plugin options.
     */
    const defaultPluginOptions = {
        args: {
            target: 'var/cache/fosRoutes.json',
            format: 'json',
            locale: '',
            prettyPrint: false,
            domain: [],
            extraArgs: {}
        },
        transformCheckFileTypes: /\.(js|jsx|ts|tsx|vue)$/,
        verbose: false,
        php: 'php',
    }

    /**
     * Merges the default options with the user options.
     */
    const finalPluginOptions: VitePluginSymfonyFosRoutingOptions = {
        ...defaultPluginOptions,
        ...pluginOptions
    }

    /**
     * Resolves the target path.
     */
    const finalTarget = path.resolve(process.cwd(), finalPluginOptions.args.target);

    /**
     * Resolve the target path to a temporary file.
     */
    finalPluginOptions.args.target = path.resolve(process.cwd(), finalPluginOptions.args.target.replace(/\.json$/, '.tmp.json'));


    /**
     * Prevents the target from being the same as the final target.
     */
    if (finalPluginOptions.args.target === finalTarget) {
        finalPluginOptions.args.target += '.tmp';
    }

    /**
     * Target shortcut.
     */
    const target = finalPluginOptions.args.target;

    /**
     * Runs the command to generate the fos routes.
     * Also checks if the routes have changed and saves them to a file.
     * Then sets shouldInject to true if the routes have changed.
     */
    async function runCmd() {
        shouldInject = false;

        if (finalPluginOptions.verbose) {
            console.log('Generating fos routes...')
        }

        try {
            const args = objectToArg(finalPluginOptions.args);

            // Dump routes
            await execFileSync(finalPluginOptions.php, ['bin/console', 'fos:js-routing:dump', ...args], {
                stdio: finalPluginOptions.verbose ? 'inherit' : undefined
            });

            const content = await fs.readFileSync(target);
            if (fs.existsSync(target)) {
                await fs.rmSync(target); // Remove the temporary file
            }
            // Check if there are new routes
            if (!prevContent || content.compare(prevContent) !== 0) {
                fs.mkdirSync(path.dirname(finalTarget), {recursive: true});
                await fs.writeFileSync(finalTarget, content);
                prevContent = content;
                shouldInject = true;
            }

        } catch (err) {
            logger.error(err.toString());
        }
        return []
    }

    return {
        name: 'rollup-plugin-symfony-fos-routing',
        /**
         * Runs the command on build start.
         */
        async buildStart() {
            await runCmd();
        },
        /**
         * Runs the command on hot update.
         */
        async handleHotUpdate() {
            await runCmd();
        },

        /**
         * Injects the routes into the code.
         * @param code
         * @param id
         */
        async transform(code, id) {
            // Inject if shouldInject is true and the file is matched by the transformCheckFileTypes regex.
            if (shouldInject && defaultPluginOptions.transformCheckFileTypes.test(id)) {
                return {
                    code: code.replace(
                        /import\s+Routing\s+from\s+"fos-router"\s*;/,
                        `
                        import Routing from "fos-router";
                        import routes from ${JSON.stringify(finalTarget)};
                        Routing.setRoutingData(routes);
                      `),
                    map: null
                };
            }

            return {
                code,
                map: null
            };
        },

    };
}
