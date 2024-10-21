## v7.0.5

- add origin to internal tags ([@seggewiss](https://github.com/seggewiss))

## v7.0.4

- fix use `proxy_origin` in Debugger if configured (@andyexeter)

## v7.0.3

- stimulus fix import.meta regex to support comments

## v7.0.2

- stimulus plugin check module entrypoint inside controllers.json
- fix vite-plugin-symfony partial options TypeScript type.

## v7.0.1

- fix Symfony try to register twice `TypeExtension`.

## v7.0.0

- new Profiler
- change crossorin default value
- better `PreloadAssetsEventListener`
- stimulus refactorisation

## v6.5.3

- fix vite-plugin-symfony tsup export when package is ESM.

## v6.5.2

- fix dummy-non-existing-folder to be created when used with vitest UI.

## v6.5.1

- fix overriding types from '@hotwired/stimulus'

## v6.5.0

- move v6.4.7 to 6.5.0 : flex recipes accept only minor version number (not patch).

## v6.4.7

- vite-bundle : prepare v7 flex recipe add pentatrion_vite.yaml route file into install directory 

## v6.4.6

- vite-bundle : add throw_on_missing_asset option

## v6.4.5

- vite-bundle : fix Crossorigin attribute needs adding to Link headers (@andyexeter)
- vite-bundle : Skip devServer lookup if proxy is defined (@Blackskyliner)
- vite-bundle : fix typo in error message when outDir is outside project root (@acran)

## v6.4.4

- vite-plugin-symfony : fix typo in error message when outDir is outside project root (@acran)
- vite-plugin-symfony : revert emptying `outDir` in dev mode (thanks @nlemoine)

## v6.4.3

- vite-bundle : fix deprecation warning with `configs` key in multiple config.

## v6.4.2

- doc add https tip with symfony cli certificate. (@nlemoine)
- fixed symfony/ux-react inability to load tsx components (@vladcos)

## v6.4.1

- fix import.meta in cjs env
- vite-plugin-symfony : fix Displaying the statuses of Stimulus controllers in production https://github.com/lhapaipai/vite-plugin-symfony/issues/38

## v6.4.0

- vite-plugin-symfony : add exposedEnvVars option
- vite-plugin-symfony : fix enforcePluginOrderingPosition https://github.com/lhapaipai/vite-bundle/issues/80
## v6.3.6

- fix crossorigin attribute to Link header for scripts with type=module (@andyexeter)

## v6.3.5

- fix vite-plugin-symfony support having externals dependencies.
- increase vite-bundle php minimum compatibility to 8.0
  no major version because the bundle was unusable with php 7.4 because of mixed type.

## v6.3.4

- Use Request::getUriForPath to build absolute URLs (@andyexeter)
- Formatting fix in vite printUrls output (@andyexeter)

## v6.3.3

- Fix dark mode issue with background
- Fix worker mode (kernel.reset)

## v6.3.2

- Moving package manager to pnpm

## v6.3.1

- Fix React/Vue/Svelte dependencies with Stimulus helper (@santos-pierre) 
- vite-plugin-symfony Update dependencies

## v6.3.0

- stimulus HMR
- fix bug : stimulus restart vite dev server when controllers.json is updated
- split vite-plugin-symfony into 2 plugins `vite-plugin-symfony-entrypoints` and `vite-plugin-symfony-stimulus`.
- add new tests to vite-plugin-symfony
- doc : add mermaid charts

## v6.2.0

- fix #77 support Vite 5.x

## v6.1.3

- fix #34 set warning when setting a build directory outside of your project

## v6.1.2

- stimulus lazy controllers enhancement
- Fix : prevent virtual controllers.json prebundling
- Fix : Change dependency to the non-internal ServiceLocator class (@NanoSector)
- Fix : Carelessly setting the outDir folder leads to recursive deletion (@Huppys)

## v6.1.0

- add Stimulus and Symfony UX Integration

## v6.0.1

- add `enforceServerOriginAfterListening`

## v6.0.0

- make services privates.
- add tests for EntrypointRenderer, EntrypointsLookup and TagRenderer.
- add preload option (symfony/web-link)
- add cache option
- add crossorigin option
- add preload_attributes option
- change default_build/builds to default_config/configs
- fix baseUrl to files #67
- refactor RenderAssetTagEvent 
