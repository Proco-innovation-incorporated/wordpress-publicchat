<template>
  <div class="spinner-wrapper" v-if="loading" :class="[
    type === 'global'
      ? 'spinner-wrapper__page'
      : 'spinner-wrapper__local'
  ]">
    <img :src="Loader" alt="">
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


</style>
