import process from "node:process";
import type { ResolvedConfig } from "vite";
import { getLegacyName, prepareRollupInputs, resolveUserExternal } from "./utils";
import { EntryPoints, GeneratedFiles, FileInfos, FilesMetadatas, BuildEntryPoint } from "../types";
import { getOutputPath } from "./pathMapping";

export const getDevEntryPoints = (config: ResolvedConfig, viteDevServerUrl: string): EntryPoints => {
  const entryPoints: EntryPoints = {};

  for (const [entryName, { inputRelPath, inputType }] of Object.entries(prepareRollupInputs(config))) {
    entryPoints[entryName] = {
      [inputType]: [`${viteDevServerUrl}${config.base}${inputRelPath}`],
    };
  }
  return entryPoints;
};

export const getFilesMetadatas = (base: string, generatedFiles: GeneratedFiles): FilesMetadatas => {
  return Object.fromEntries(
    Object.values(generatedFiles)
      .filter((fileInfos: FileInfos) => fileInfos.hash)
      .map((fileInfos: FileInfos) => [
        `${base}${fileInfos.outputRelPath}`,
        {
          hash: fileInfos.hash,
        },
      ]),
  );
};

export const getBuildEntryPoints = (generatedFiles: GeneratedFiles, viteConfig: ResolvedConfig): EntryPoints => {
  const entryPoints: EntryPoints = {};
  let hasLegacyEntryPoint = false;

  /** get an Array of entryPoints from build.rollupOptions.input inside vite config file  */
  const entryFiles = prepareRollupInputs(viteConfig);

  for (const [entryName, entry] of Object.entries(entryFiles)) {
    const outputRelPath = getOutputPath(entry.inputRelPath);
    if (!outputRelPath) {
      console.error("unable to get outputPath", entry.inputRelPath);
      process.exit(1);
    }

    const fileInfos = generatedFiles[outputRelPath];

    if (!fileInfos) {
      console.error("unable to map generatedFile", entry, outputRelPath, fileInfos);
      process.exit(1);
    }

    const legacyInputRelPath = getLegacyName(entry.inputRelPath);
    const legacyFileInfos = generatedFiles[getOutputPath(legacyInputRelPath)!] ?? null;

    if (legacyFileInfos) {
      hasLegacyEntryPoint = true;
      entryPoints[`${entryName}-legacy`] = resolveBuildEntrypoint(legacyFileInfos, generatedFiles, viteConfig, false);
    }

    entryPoints[entryName] = resolveBuildEntrypoint(
      fileInfos,
      generatedFiles,
      viteConfig,
      hasLegacyEntryPoint ? `${entryName}-legacy` : false,
    );
  }
 
  /**
   * legacy polyfills target browsers that don't support ESM at all.
   * added as <script nomodule> tags for legacy browsers.
   * @see https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#polyfills 
   * */
  const polyfills = getOutputPath("vite/legacy-polyfills-legacy")

  if (hasLegacyEntryPoint && polyfills) {
    const fileInfos = generatedFiles[polyfills];
    if (fileInfos) {
      entryPoints["polyfills-legacy"] = resolveBuildEntrypoint(fileInfos, generatedFiles, viteConfig, false);
    }
  }

  /** 
   * modern polyfills target browsers that support ESM but lack certain widely-available features.
   * added as <script type="module"> tags in HTML.
   * @see https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#modernpolyfills */
  const modernPolyfills = getOutputPath("vite/legacy-polyfills")

  if (modernPolyfills) {
    const fileInfos = generatedFiles[modernPolyfills];
    if(fileInfos) {
      entryPoints["polyfills"] = resolveBuildEntrypoint(fileInfos, generatedFiles, viteConfig, false);
    }
  }

  return entryPoints;
};

export const resolveBuildEntrypoint = (
  fileInfos: FileInfos,
  generatedFiles: GeneratedFiles,
  config: ResolvedConfig,
  legacyEntryName: boolean | string,
  resolvedImportOutputRelPaths: string[] = [],
): BuildEntryPoint => {
  const css: string[] = [];
  const js: string[] = [];
  const preload: string[] = [];
  const dynamic: string[] = [];

  resolvedImportOutputRelPaths.push(fileInfos.outputRelPath);

  if (fileInfos.type === "js") {
    for (const importOutputRelPath of fileInfos.imports) {
      if (resolvedImportOutputRelPaths.indexOf(importOutputRelPath) !== -1) {
        continue;
      }

      resolvedImportOutputRelPaths.push(importOutputRelPath);

      const importFileInfos = generatedFiles[importOutputRelPath];
      if (!importFileInfos) {
        const isExternal = config.build.rollupOptions.external
          ? resolveUserExternal(
              config.build.rollupOptions.external,
              importOutputRelPath, // use URL as id since id could not be resolved
              fileInfos.inputRelPath,
              false,
            )
          : false;

        if (isExternal) {
          continue;
        }

        throw new Error(`Unable to find ${importOutputRelPath}`);
      }

      const {
        css: importCss,
        dynamic: importDynamic,
        js: importJs,
        preload: importPreload,
      } = resolveBuildEntrypoint(importFileInfos, generatedFiles, config, false, resolvedImportOutputRelPaths);

      for (const dependency of importCss) {
        if (css.indexOf(dependency) === -1) {
          css.push(dependency);
        }
      }

      // imports are preloaded not js files
      for (const dependency of importJs) {
        if (preload.indexOf(dependency) === -1) {
          preload.push(dependency);
        }
      }
      for (const dependency of importPreload) {
        if (preload.indexOf(dependency) === -1) {
          preload.push(dependency);
        }
      }
      for (const dependency of importDynamic) {
        if (dynamic.indexOf(dependency) === -1) {
          dynamic.push(dependency);
        }
      }
    }

    fileInfos.js.forEach((dependency) => {
      if (js.indexOf(dependency) === -1) {
        js.push(`${config.base}${dependency}`);
      }
    });
    fileInfos.preload.forEach((dependency) => {
      if (preload.indexOf(dependency) === -1) {
        preload.push(`${config.base}${dependency}`);
      }
    });
    fileInfos.dynamic.forEach((dependency) => {
      if (dynamic.indexOf(dependency) === -1) {
        dynamic.push(`${config.base}${dependency}`);
      }
    });
  }

  if (fileInfos.type === "js" || fileInfos.type === "css") {
    fileInfos.css.forEach((dependency) => {
      if (css.indexOf(dependency) === -1) {
        css.push(`${config.base}${dependency}`);
      }
    });
  }

  return { css, dynamic, js, legacy: legacyEntryName, preload };
};
