/*
 * Use store pattern instead of Vuex since this is a plugin
 * and instantiated externally
 **/



import {computed, ref} from "vue";

const store = {
  state: ref({
    editMessage: null,
    loadedConnection: false,
  }),
  setupFirst: () => {
    store.state = ref({
      editMessage: null
    })
  },

  setState(key, val) {
    this.state.value = {
      ...this.state.value,
      [key]: val
    }
  }
}

function mapState(keys) {
  const map = {}
  debugger
  keys.forEach((key) => {
    map[key] = computed(() => {
      return store.state.value[key]
    })
  })
  return map
}
window.store = store
export default store
export {mapState}
