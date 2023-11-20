// import { registerVueControllerComponents } from '@symfony/ux-vue';
// import { registerSvelteControllerComponents } from '@symfony/ux-svelte';
// import { registerReactControllerComponents } from '@symfony/ux-react';
import './bootstrap.js';

function refreshStickStatus() {
  $nav.classList.toggle("stuck", document.documentElement.scrollTop > 0);
}

let $nav = document.querySelector("#nav");
if ($nav) {
  window.addEventListener("scroll", refreshStickStatus);
  refreshStickStatus();



}

// if (import.meta.hot) {
//   import.meta.hot.accept((mod, ctx) => {
//     import.meta.hot.send('restart')
//     console.log(mod, ctx)
//   })
// }