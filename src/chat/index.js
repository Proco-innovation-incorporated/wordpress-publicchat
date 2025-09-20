import Launcher from './Launcher.vue'
import FloatingVue from 'floating-vue';

const defaultComponentName = 'BubbleChat'

const Plugin = {
  install(Vue, options = {}) {
    /**
     * Makes sure that chat-plugin can be installed only once
     */
    if (this.installed) {
      return
    }

    this.installed = true
    this.event = Vue
    this.dynamicContainer = null
    this.componentName = options.componentName || defaultComponentName
    /**
     * Plugin API
     */
    Vue.$chat = {
      _setDynamicContainer(dynamicContainer) {
        Plugin.dynamicContainer = dynamicContainer
      }
    }
    /**
     * Sets custom component name (if provided)
     */
    Vue.component(this.componentName, Launcher)
    Vue.use(FloatingVue)
  }
}

export default Plugin
