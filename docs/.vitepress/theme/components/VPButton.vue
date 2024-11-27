<script setup lang="ts">
import { computed } from 'vue';
import { normalizeLink } from 'vitepress/dist/client/theme-default/support/utils';
import { EXTERNAL_URL_RE } from 'vitepress/dist/client/shared';

const props = defineProps<{
  tag?: string;
  size?: 'medium' | 'big';
  theme?: 'brand' | 'alt' | 'sponsor';
  text: string;
  href?: string;
}>();

const classes = computed(() => [props.size ?? 'medium', props.theme ?? 'brand']);

const isExternal = computed(() => props.href && EXTERNAL_URL_RE.test(props.href));

const component = computed(() => {
  if (props.tag) {
    return props.tag;
  }

  return props.href ? 'a' : 'button';
});
</script>

<template>
  <component
    :is="component"
    class="VPButton"
    :class="classes"
    :href="href ? normalizeLink(href) : undefined"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noreferrer' : undefined"
    v-ripple
  >
    {{ text }}
  </component>
</template>

<style scoped>
.VPButton {
  display: inline-block;
  border: 0;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s,
    box-shadow 0.25s;

  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.15),
    0 2px 2px 0px rgba(0, 0, 0, 0.15),
    0 1px 5px 0px rgba(0, 0, 0, 0.1);

  &:focus {
    box-shadow:
      0 3px 1px -2px rgba(0, 0, 0, 0.15),
      0 2px 2px 0px rgba(0, 0, 0, 0.15),
      0 1px 5px 0px rgba(0, 0, 0, 0.1);
  }

  &:hover {
    box-shadow:
      0 2px 4px -1px rgba(0, 0, 0, 0.15),
      0 4px 5px 0px rgba(0, 0, 0, 0.15),
      0 1px 10px 0px rgba(0, 0, 0, 0.1);
  }

  &:active {
    box-shadow:
      0 5px 5px -3px rgba(0, 0, 0, 0.15),
      0 8px 10px 1px rgba(0, 0, 0, 0.15),
      0 3px 14px 2px rgba(0, 0, 0, 0.1);
    transition:
      color 0.1s,
      border-color 0.1s,
      background-color 0.1s,
      box-shadow 0.1s;
  }

  &.medium {
    border-radius: 5px;
    padding: 0 20px;
    line-height: 38px;
    font-size: 14px;
  }

  &.big {
    padding: 0 24px;
    line-height: 46px;
    font-size: 16px;
  }

  &.brand {
    color: var(--vp-button-brand-text);
    background-color: var(--vp-button-brand-bg);

    &:hover {
      color: var(--vp-button-brand-hover-text);
    }

    &:active {
      color: var(--vp-button-brand-active-text);
      background-color: var(--vp-button-brand-active-bg);
    }
  }

  &.alt {
    color: var(--vp-button-alt-text);
    background-color: var(--vp-button-alt-bg);

    &:hover {
      color: var(--vp-button-alt-hover-text);
      background-color: var(--vp-button-alt-hover-bg);
    }

    &:active {
      color: var(--vp-button-alt-active-text);
      background-color: var(--vp-button-alt-active-bg);
    }
  }

  &.sponsor {
    color: var(--vp-button-sponsor-text);
    background-color: var(--vp-button-sponsor-bg);

    &:hover {
      color: var(--vp-button-sponsor-hover-text);
      background-color: var(--vp-button-sponsor-hover-bg);
    }

    &:active {
      color: var(--vp-button-sponsor-active-text);
      background-color: var(--vp-button-sponsor-active-bg);
    }
  }
}
</style>
