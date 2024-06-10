/* eslint-disable import/order */
import VTooltip from 'v-tooltip';
import { createApp } from 'vue'
import styles from './style.css?inline'
import App from './App.vue'
import Launcher from './chat/Launcher.vue';
import store from './chat/store'
import './chat/socket'
declare const window: any;
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
window.apiBaseUrl =
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
