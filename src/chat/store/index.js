/*
 * Use store pattern instead of Vuex since this is a chat-plugin
 * and instantiated externally
 **/

import { computed, ref } from "vue";

const store = {
  state: ref({
    editMessage: null,
    loadedConnection: false,
    error: null,
    isMessageSending: true,
  }),
  tokens: {
    access_token: null,
    refresh_token: null,
  },
  socket: null,
  setSocket(socket, userId) {
    this.socket = socket;
    this.socket.userId = userId;
  },
  setupFirst: () => {
    store.state = ref({
      editMessage: null,
    });
  },

  setState(key, val) {
    this.state.value = {
      ...this.state.value,
      [key]: val,
    };
  },
};

function mapState(keys) {
  const map = {};
  keys.forEach((key) => {
    map[key] = computed(() => {
      return store.state.value[key];
    });
  });
  return map;
}

function sendSocketMessage(message, attachments = []) {
  if (store.socket) {
    store.socket.send(
      JSON.stringify({
        version: "v1",
        message: message,
        userid: store.socket.userId,
        attachments: attachments,
      })
    );
  }
}

function closeSocketConnection() {
  store.socket = null;
}
window.store = store;
export default store;
export { mapState, sendSocketMessage, closeSocketConnection };
