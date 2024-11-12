/* eslint-disable import/order */

import VTooltip from 'v-tooltip';
import { createApp } from 'vue'
import styles from './style.css?inline'
import App from './App.vue'
import Launcher from './chat/Launcher.vue';
import store from './chat/store'
import './chat/socket'
declare const window: any;
(function (){
  window.pluginPath = import.meta.env.MODE === 'development' ? '' : '/wp-content/plugins/chat-plugin/assets';
  window.apiBaseUrl = import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_BASE_URL : '';
  window.wsBaseUrl = import.meta.env.MODE === 'development' ? import.meta.env.VITE_WS_BASE_URL : '';
  // before new build, make sure the title is correct
  window.botTitle = 'WSI AI Assistant';
  
  store.setupFirst()
  const shadowRoot = document.createElement('div')
  shadowRoot.style.position = 'absolute'
  shadowRoot.style.zIndex = '100000000000000000'
  document.body.append(shadowRoot)
  if(shadowRoot) {
    const shadow = shadowRoot.attachShadow({mode: 'open'})
    const style = document.createElement('style');
    const chat = document.createElement('div');
    chat.id='chat'
    style.textContent = styles;
    shadow.appendChild(style);
    shadow.appendChild(chat);
    createApp(App)
      .component('BubbleChat', Launcher)
      .use(VTooltip)
      .mount(chat);
  
  }
  window.setupChatData = ({ access_token, refresh_token, org_token, userEmail, userName, userSurname }: any = {}) => {
    if(!access_token || !userEmail || !org_token || !refresh_token) {
      throw new Error('Ezee Assist chat should have client Identificator and email of user.')
    }
  
    store.setState('chatData', {
      access_token,
      refresh_token,
      org_token,
      userEmail,
      userName,
      userSurname
    })
  }
})()
