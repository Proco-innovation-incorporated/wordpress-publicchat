<template>
  <div class="sc-suggestions-row" :style="{background: colors.messageList.bg}">
    <button
      v-for="(suggestion, idx) in suggestions"
      :key="idx"
      class="sc-suggestions-element"
      :style="{
        borderColor: colors.sentMessage.bg,
        color: colors.sentMessage.bg
      }"
      @click="$emit('sendSuggestion', suggestion)"
    >
      {{ suggestion }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    suggestions: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>

<style>
</style>
