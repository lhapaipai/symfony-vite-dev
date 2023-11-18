<template>
  <div class="vue-app">
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img :src="viteLogo" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img :src="vueLogo" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import vueLogo from '~/images/logo-vue.svg';
import viteLogo from '~/images/logo-vite.svg'

</script>

<style>
.vue-app {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo {
  height: 10em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>