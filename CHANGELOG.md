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
