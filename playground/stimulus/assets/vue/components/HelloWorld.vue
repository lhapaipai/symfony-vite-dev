<template>
  <h1>Hello {{ name }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>
    <code>assets/vue/components/HelloWorld.vue</code>
  </p>
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

