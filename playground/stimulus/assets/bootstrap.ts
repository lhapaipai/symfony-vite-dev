import {
  startStimulusApp,
  registerControllers,
} from "vite-plugin-symfony/stimulus/helpers";
import {
  registerReactControllerComponents,
  type ReactModule,
} from "vite-plugin-symfony/stimulus/helpers/react";
import {
  registerVueControllerComponents,
  type VueModule,
} from "vite-plugin-symfony/stimulus/helpers/vue";
import {
  registerSvelteControllerComponents,
  type SvelteModule,
} from "vite-plugin-symfony/stimulus/helpers/svelte";

registerVueControllerComponents(
  import.meta.glob<VueModule>("./vue/controllers/**/*.vue")
);
registerReactControllerComponents(
  import.meta.glob<ReactModule>("./react/controllers/**/*.[jt]s(x)?")
);
registerSvelteControllerComponents(
  import.meta.glob<SvelteModule>("./svelte/controllers/**/*.svelte")
);

const app = startStimulusApp();

registerControllers(
  app,
  import.meta.glob<StimulusControllerInfosImport>(
    "./controllers/*_controller.ts",
    {
      query: "?stimulus",
      eager: true,
    }
  )
);
