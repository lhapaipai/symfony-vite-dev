import { createApp } from "vue";
import App from '~/lib/App.vue'

const $app = document.getElementById('app');

let app = createApp(App);
if ($app) {
  app.mount($app)
}