<template>
  <div class="spiner-wrapper" v-if="loading" :class="[
    type === 'global'
      ? 'spiner-wrapper__page'
      : 'spiner-wrapper__local'
  ]">
    <img :src="Loader" alt="Loader">
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onBeforeUnmount } from "vue";
import { watch } from 'vue'
import Loader from '../assets/loader.svg'
import { LoaderManagerInstance } from './index';

const props = withDefaults(defineProps<{
  isLoading?: Boolean,
  type: String,
  name: String,
}>(), {
  type: 'local',
  isLoading: false,
  name: ''
});

const loading = ref(props.isLoading);
if (props.name) {
  LoaderManagerInstance.registerLoaderInstance(props.name, getCurrentInstance());
}

onBeforeUnmount(() => {
  LoaderManagerInstance.unRegisterLoaderInstance(props.name)
});

watch(
  () => props.isLoading,
  (newData) => {

    loading.value = newData;
  }
);
</script>

<style lang="scss" scoped>
//@import "@styles/mixins";

.spiner-wrapper {
  background: var(--gray_400); // TODO move to var
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000000;
  display: flex;
  justify-content: center;
  align-items: center;
  //@include flexFullCenter;

  img {
    width: 220px;
    height: 248px;
  }

  &.spiner-wrapper__page {
    position: fixed;
  }

  &.spiner-wrapper__local {
    position: absolute;

    img {
      width: 80px;
      height: 100px;
    }
  }

}
</style>
