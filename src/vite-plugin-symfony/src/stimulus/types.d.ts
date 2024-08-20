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
  main?: string;
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
