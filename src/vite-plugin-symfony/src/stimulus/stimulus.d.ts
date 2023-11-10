declare module "virtual:symfony/controllers" {
  import { type ControllerConstructor } from "@hotwired/stimulus";
  const modules: {
    [controllerName: string]: ControllerConstructor;
  };
  export default modules;
}

interface StimulusControllerFileInfos {
  identifier: undefined | string;
  lazy: boolean;
}

type ControllerUserConfig = {
  enabled?: boolean;
  fetch?: "eager" | "lazy";
  name?: string;
  autoimport?: {
    [path: string]: boolean;
  };
  main?: string;
};

type ControllersConfig = {
  controllers: {
    [packageName: string]: {
      [controllerName: string]: ControllerUserConfig;
    };
  };
  entrypoints: {
    [key: string]: string;
  };
};
