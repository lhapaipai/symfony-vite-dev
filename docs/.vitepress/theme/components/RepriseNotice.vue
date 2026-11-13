<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';

const { localeIndex } = useData();

const notices = {
  root: {
    title: 'Try Symfony Reprise',
    description:
      '<a href="https://symfony.com/packages/reprise">Symfony Reprise</a> is the official Symfony integration for Vite, and it is the recommended choice for new projects. If you already use <code>pentatrion/vite-bundle</code> and <code>vite-plugin-symfony</code>, a <a href="https://symfony.com/bundles/reprise#migrating-from-pentatrion-vite-bundle">migration guide</a> is available.'
  },
  fr: {
    title: 'Découvrir Symfony Reprise',
    description:
      '<a href="https://symfony.com/packages/reprise">Symfony Reprise</a> est l\'intégration officielle de Vite pour Symfony, et elle est recommandée pour les nouveaux projets. Si vous utilisez déjà <code>pentatrion/vite-bundle</code> et <code>vite-plugin-symfony</code>, un <a href="https://symfony.com/bundles/reprise#migrating-from-pentatrion-vite-bundle">guide de migration</a> est disponible.'
  }
};

const notice = computed(() => (localeIndex.value === 'fr' ? notices.fr : notices.root));
</script>

<template>
  <div class="tip custom-block">
    <p class="custom-block-title">{{ notice.title }}</p>
    <p v-html="notice.description"></p>
  </div>
</template>

<style scoped>
.custom-block {
  margin-bottom: 24px;
}
</style>
