import { startStimulusApp, registerVueControllerComponents, registerReactControllerComponents} from "vite-plugin-symfony/stimulus/helpers"

// registerVueControllerComponents(import.meta.glob('./vue/controllers/**/*.vue'))
const context = import.meta.glob('./react/controllers/**/*.[jt]s(x)\?');
console.log('context', context)
registerReactControllerComponents(context);
const app = startStimulusApp(import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'));


