<template>
  <div class="sc-typing-indicator" :style="messageColors">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script>
export default {
  props: {
    messageColors: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
</style>
