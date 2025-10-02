<template>
  <div class="sc-message--emoji">{{ data.emoji }}</div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
