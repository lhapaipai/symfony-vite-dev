import { startStimulusApp } from "vite-plugin-symfony/stimulus-helpers"

const app = startStimulusApp(import.meta.glob('./controllers/*_controller.js'));


