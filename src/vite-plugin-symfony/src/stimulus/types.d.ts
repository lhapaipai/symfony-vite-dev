export type ControllerConfig = {
  enabled?: boolean;
  fetch?: "eager" | "lazy";

  /**
   * equivalent to controller identifier
   */
  name?: string;
  autoimport?: {
    [path: string]: boolean;
  };

  /**
   * Entrypoint.
   * if module is set : commonjs entrypoint
   */
  main?: string;

  /**
   * for the future ?
   * ESM entrypoint
   */
  module?: string;
};

export type ControllersFileContent = {
  controllers: {
    [packageName: string]: {
      [controllerName: string]: ControllerConfig;
    };
  };
  entrypoints: {
    [key: string]: string;
  };
};
