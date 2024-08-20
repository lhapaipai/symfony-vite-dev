import {
  createLazyController,
  startStimulusApp,
  registerControllers,
  registerController,
} from "vite-plugin-symfony/stimulus/helpers";

/* for color-picker */
import "@simonwep/pickr/dist/themes/classic.min.css";

import otherControllerInfos from "./controllers/otherController?stimulus";

const app = startStimulusApp();

registerController(app, otherControllerInfos);

app.register(
  "color-picker",
  createLazyController(() => import("@stimulus-components/color-picker")),
);

registerControllers(
  app,
  import.meta.glob<StimulusControllerInfosImport>(
    "./controllers/*_controller.ts",
    {
      query: "?stimulus",
      eager: true,
    },
  ),
);
