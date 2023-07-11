import "rollup";

declare module "rollup" {
  export interface RenderedChunk {
    viteMetadata?: ChunkMetadata;
  }
}

export interface ChunkMetadata {
  importedAssets: Set<string>;
  importedCss: Set<string>;
}

export type FileWithHash = {
  path: string;
  hash: string | null;
};

export type EntryPointsFile = {
  isProd: boolean;
  viteServer:
    | {
        origin: string;
        base: string;
      }
    | false;
  entryPoints: EntryPoints;
  assets: StringMapping;
  legacy: boolean;
};

export type EntryPoint = {
  assets?: FileWithHash[];
  js?: FileWithHash[];
  css?: FileWithHash[];
  preload?: FileWithHash[];
  dynamic?: FileWithHash[];
  legacy?: boolean | string;
};
export type EntryPoints = {
  [k: string]: EntryPoint;
};

export type StringMapping = {
  [k: string]: string;
};

export type ParsedInputs = {
  [k: string]: ParsedEntry;
};

export type ParsedEntry = {
  inputType: "js" | "css";
  inputRelPath: string;
};

export type EntryFilesMapping = {
  [k: string]: string;
};

export type ManifestEntry = {
  file: string;
  src?: string;
  isEntry?: boolean;
  imports?: string[];
  css?: string[];
};

export type Manifest = {
  [k: string]: ManifestEntry;
};

export type FileInfos = JsFileInfos | CSSFileInfos | AssetFileInfos;

export type JsFileInfos = {
  type: "js";
  outputRelPath: string;
  inputRelPath: string | null;
  hash: string | null;

  imports: string[];

  assets: string[];
  js: string[];
  preload: string[];
  dynamic: string[];

  css: string[];
};
export type CSSFileInfos = {
  type: "css";
  outputRelPath: string;
  inputRelPath: string | null;
  hash: string | null;

  css: string[];
};
export type AssetFileInfos = {
  type: "asset";
  outputRelPath: string;
  inputRelPath: string | null;
  hash: string | null;
};

export type GeneratedFiles = {
  [inputRelPath: string]: FileInfos;
};

export type DevServerUrl = `${"http" | "https"}://${string}:${number}`;

export type HashAlgorithm = false | "sha256" | "sha384" | "sha512";

export type VitePluginSymfonyOptions = {
  /**
   * Web directory root
   * Relative file path from project directory root.
   * @default 'public'
   * @deprecated use `build.outDir`: join(publicDirectory, buildDirectory) from vite config
   */
  publicDirectory: string;

  /**
   * Build directory (or path)
   * Relative path from web directory root
   * @default 'build'
   * @deprecated use `base`: "/" + buildDirectory + "/" from vite config
   */
  buildDirectory: string;

  /**
   * By default vite-plugin-symfony set vite option publicDir to false.
   * Because we don't want symfony entrypoint (index.php) and other files to
   * be copied into the build directory.
   * Related to this issue : https://github.com/lhapaipai/vite-bundle/issues/17
   *
   * Vite plugin Symfony use sirv to serve public directory.
   *
   * If you want to force vite option publicDir to true, set servePublic to false.
   *
   * @default 'public'
   */
  servePublic: false | string;

  /**
   * Refresh vite dev server when your twig templates are updated.
   *  - array of paths to files to be watched, or glob patterns
   *  - true : equivalent to ["templates/**\/*.twig"]
   * @default false
   *
   * for additional glob documentation, check out low-level library picomatch : https://github.com/micromatch/picomatch
   */
  refresh: boolean | string[];

  /**
   * If you specify vite `server.host` option to '0.0.0.0' (usage with Docker)
   * You probably need to configure your `viteDevServerHostname` to 'localhost'.
   * Related to this issue : https://github.com/lhapaipai/vite-bundle/issues/26
   *
   * @default null
   */
  viteDevServerHostname: null | string;

  /**
   * Add an integrity attribute to your <script> <link> elements
   * @default false
   */
  sriAlgorithm: HashAlgorithm;

  /**
   * Show vite resolved config
   * @default false
   */
  debug: boolean;
};
