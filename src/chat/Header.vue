<template>
  <div class="sc-header" :style="{background: colors.header.bg, color: colors.header.text}">
    <img v-if="titleImageUrl" class="sc-header--img" :src="titleImageUrl" height="60px" alt="" />
    <div v-if="!disableUserListToggle" class="sc-header--title">
      {{ title }}
    </div>
    <div v-else class="sc-header--title">{{ title }}</div>
    <div v-if="showCloseButton" class="sc-header--close-button" @click="$emit('close')">
      <img :src="icons.close.img" :alt="icons.close.name" />
    </div>
  </div>
</template>

<script>
import {mapState} from './store/'
import CloseIcon from './assets/close-icon-big.png'

export default {
  props: {
    icons: {
      type: Object,
      default: function () {
        return {
          close: {
            img: CloseIcon,
            name: 'default'
          }
        }
      }
    },
    title: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      inUserList: false
    }
  },
  setup () {
    return {
      ...mapState(['disableUserListToggle', 'titleImageUrl', 'showCloseButton'])
    }
  },
  methods: {
    toggleUserList() {
      this.inUserList = !this.inUserList
      this.$emit('userList', this.inUserList)
    }
  }
}
</script>

<style scoped>
</style>
