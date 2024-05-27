import VTooltip from 'v-tooltip';
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Launcher from './chat/Launcher.vue';
import store from './chat/store'

window.vue = createApp(App)
  .component('BubbleChat', Launcher)
  .use(VTooltip)
store.setupFirst()
window.vue.mount('#app')

