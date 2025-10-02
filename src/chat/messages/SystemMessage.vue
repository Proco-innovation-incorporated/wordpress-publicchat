<template>
  <div class="sc-message--system" :style="messageColors">
    <slot :message="data">
      {{ data.text }}
      <p v-if="data.meta" class="sc-message--meta" :style="{color: messageColors.color}">
        {{ data.meta }}
      </p>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
