<template>
  <h1>Hello {{ name }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <code>assets/page/vue/components/HelloWorld.vue</code>
  <p>Edit component to test hot module replacement.</p>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    name: String
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>
