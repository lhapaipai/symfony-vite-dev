## v6.3.1

- Fix React/Vue/Svelte dependencies with Stimulus helper (@santos-pierre) 

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
