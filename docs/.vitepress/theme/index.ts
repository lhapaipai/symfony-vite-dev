// https://vitepress.dev/guide/custom-theme
// list of components : https://github.com/vuejs/vitepress/tree/main/src/client/theme-default/components
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import { rippleDirective } from './directives';

export default {
  extends: DefaultTheme,

  /* https://vitepress.dev/guide/extending-default-theme#layout-slots */
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {});
  // },

  async enhanceApp({ app }) {
    app.directive('ripple', rippleDirective);
  }
} satisfies Theme;
