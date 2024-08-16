import {
  startStimulusApp,
  registerControllers,
} from "vite-plugin-symfony/stimulus/helpers";

const app = startStimulusApp();

registerControllers(
  app,
  import.meta.glob("./controllers/*_(lazy)?controller.[jt]s(x)?"),
);
