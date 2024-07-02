import {computed} from 'vue'
export default computed(() => [
  {
    id: 'user',
    name: 'User',
    imageUrl: 'https://ca.slack-edge.com/T051W2K0NLC-U06J3BT0H5K-06b1c7f7c565-512'
  },
  {
    id: 'bot',
    name: 'Ezee Assist',
    imageUrl: window.pluginPath + '/bot-logo.png'
  }
])
