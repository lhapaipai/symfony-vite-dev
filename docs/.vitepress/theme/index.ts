// https://vitepress.dev/guide/custom-theme
// list of components : https://github.com/vuejs/vitepress/tree/main/src/client/theme-default/components
import { h } from 'vue';
import Theme from 'vitepress/theme';
import './style.css';
import { rippleDirective } from './directives';

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {});
  },
  enhanceApp({ app }) {
    app.directive('ripple', rippleDirective);
  }
};
