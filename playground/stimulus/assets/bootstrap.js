/// <reference types="vite/client" />

import {
  startStimulusApp,
  registerControllers,
} from "vite-plugin-symfony/stimulus/helpers";
import { registerReactControllerComponents } from "vite-plugin-symfony/stimulus/helpers/react";
import { registerVueControllerComponents } from "vite-plugin-symfony/stimulus/helpers/vue";
import { registerSvelteControllerComponents } from "vite-plugin-symfony/stimulus/helpers/svelte";


registerVueControllerComponents(import.meta.glob('./vue/controllers/**/*.vue'))
registerReactControllerComponents(import.meta.glob('./react/controllers/**/*.[jt]s(x)\?'));
registerSvelteControllerComponents(import.meta.glob('./svelte/controllers/**/*.svelte'));

const app = startStimulusApp();
registerControllers(app, import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'))

