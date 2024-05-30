/* eslint-disable import/order */
import VTooltip from 'v-tooltip';
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Launcher from './chat/Launcher.vue';
import store from './chat/store'
import './chat/socket'

window.vue = createApp(App)
  .component('BubbleChat', Launcher)
  .use(VTooltip)
declare const window: any;
store.setupFirst()
window.vue.mount('#app');

window.setupChatData = ({ clientId, userEmail, userName, userSurname }: any = {}) => {

  if(!clientId || !userEmail) {
    throw new Error('Ezee Assist chat should have client Identificator and email of user.')
  }

  store.setState('chatData', {
    clientId,
    userEmail,
    userName,
    userSurname
  })


}

