<template>
  <div class="content">
    <img alt="Vue logo" :src="logoVue" width="261" height="226" />
    <HelloWorld :name="name" />
  </div>
</template>

<script setup>
import HelloWorld from '../components/HelloWorld.vue'
import logoVue from '~/images/logo-vue.svg';

defineProps({
  name: String
})
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>