import { startStimulusApp, registerVueControllerComponents} from "vite-plugin-symfony/stimulus/helpers"

registerVueControllerComponents(import.meta.glob('./vue/controllers/**/*.vue'))

const app = startStimulusApp(import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'));


