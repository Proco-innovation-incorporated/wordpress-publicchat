<template>
  <div class="sc-header" :style="{background: colors.header.bg, color: colors.header.text}">
    <img v-if="titleImageUrl" class="sc-header--img" :src="titleImageUrl" height="60px" alt="" />
    <div v-if="!disableUserListToggle" class="sc-header--title">
      {{ title }}
    </div>
    <div v-else class="sc-header--title">{{ title }}</div>

    <div v-if="showFullSizeChat" class="sc-header--button close-full" @click="closeFull">
      <img :src="icons.closeFull.img" alt="" />
    </div>
    <div v-else class="sc-header--button open-full" @click="openFull">
      <img :src="icons.openFull.img" alt="" />
    </div>

    <div v-if="showCloseButton" class="sc-header--button close" @click="$emit('close')">
      <img :src="icons.close.img" alt="" />
    </div>
  </div>
</template>

<script>
import store, { mapState } from './store/';

import CloseIcon from './assets/close-icon-big.png';
import CloseFullIcon from './assets/close-full-big.png';
import OpenFullIcon from './assets/open-full-big.png';

export default {
  props: {
    icons: {
      type: Object,
      default: function () {
        return {
          close: {
            img: CloseIcon,
            name: 'default'
          },
          closeFull: {
            img: CloseFullIcon,
            name: 'default'
          },
          openFull: {
            img: OpenFullIcon,
            name: 'default'
          },
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
  setup() {
    return {
      ...mapState([
        'disableUserListToggle',
        'titleImageUrl',
        'showCloseButton',
        'showFullSizeChat',
      ])
    }
  },
  methods: {
    toggleUserList() {
      this.inUserList = !this.inUserList
      this.$emit('userList', this.inUserList)
    },
    openFull() {
      store.setState("showFullSizeChat", true);
    },
    closeFull() {
      store.setState("showFullSizeChat", false);
    },
  }
}
</script>

<style scoped>
</style>
