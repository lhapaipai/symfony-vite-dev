## v5.0.0

- change `entrypoints.json` property `isProd` to `isBuild` because you can be in dev env and want to build your js files.

## v4.3.2

- fix #26 TypeError when no root option (@andyexeter) 

## v4.3.1

- add vendor, var and public to ignored directory for file watcher.

## v4.2.0

- add enforcePluginOrderingPosition option
- fix Integrity hash issue

## v4.1.0

- add `originOverride` (@elliason)
- deprecate `viteDevServerHostname`

## v4.0.2

- fix #24 normalized path

## v4.0.0

- add `sriAlgorithm`

## v3.3.2

- fix #16 entrypoints outside vite root directory

## v3.3.1

- fix circular reference with imports.

## v3.3.0

- add tests

## v0.6.3

- takes into account vite legacy plugin.

## v0.6.2

- add `viteDevServerHost` plugin option

## v0.6.1

- remove `strictPort: true`

## v0.6.0

- add `publicDirectory`, `buildDirectory`, `refresh`, `verbose` plugin option
- add `dev-server-404.html` page

## v0.5.2

- add `servePublic` plugin option
