/// <reference types="vite/client" />

import {
  startStimulusApp,
  registerControllers,
  registerVueControllerComponents,
  registerReactControllerComponents,
  registerSvelteControllerComponents
} from "vite-plugin-symfony/stimulus/helpers"

registerVueControllerComponents(import.meta.glob('./vue/controllers/**/*.vue'))
registerReactControllerComponents(import.meta.glob('./react/controllers/**/*.[jt]s(x)\?'));
registerSvelteControllerComponents(import.meta.glob('./svelte/controllers/**/*.svelte'));

const app = startStimulusApp();
registerControllers(app, import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'))
// registerControllers(app, import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?', {eager: true}))

