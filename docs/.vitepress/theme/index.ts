// https://vitepress.dev/guide/custom-theme
// list of components : https://github.com/vuejs/vitepress/tree/main/src/client/theme-default/components
import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import { rippleDirective } from './directives';
import RepriseNotice from './components/RepriseNotice.vue';

export default {
  extends: DefaultTheme,

  /* https://vitepress.dev/guide/extending-default-theme#layout-slots */
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(RepriseNotice)
    });
  },

  async enhanceApp({ app }) {
    app.directive('ripple', rippleDirective);
  }
} satisfies Theme;
