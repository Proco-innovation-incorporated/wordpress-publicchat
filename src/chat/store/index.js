/*
 * Use store pattern instead of Vuex since this is a chat-plugin
 * and instantiated externally
 **/

import { computed, ref } from "vue";

const EZEE_PUBLIC_CHAT_SESSION_ID = "ezee.publicChat.sessionId";

const store = {
  state: ref({
    editMessage: null,
    loadedConnection: false,
    error: null,
    isMessageSending: true,
    sessionId: null,
  }),
  tokens: {
    access_token: null,
    refresh_token: null,
  },
  socket: null,
  setSocket(socket) {
    this.socket = socket;
  },
  setupFirst: () => {
    store.state = ref({
      editMessage: null,
      sessionId: store.getSessionId(),
    });
  },
  setState(key, val) {
    this.state.value = {
      ...this.state.value,
      [key]: val,
    };
  },
  getSessionId() {
    let sessionId = window.sessionStorage.getItem(EZEE_PUBLIC_CHAT_SESSION_ID);
    console.log(`Session ID from Session Storage: ${sessionId}`);
    if (sessionId === null) {
      sessionId = window.crypto.randomUUID();
      window.sessionStorage.setItem(EZEE_PUBLIC_CHAT_SESSION_ID, sessionId);
      console.log(`Generated Session ID: ${sessionId}`);
    }
    return sessionId;
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
  if (!store.socket) return;
  store.socket.send(
    JSON.stringify({
      version: "v1",
      message: message,
      session_id: store.state.value.sessionId,
      attachments: attachments,
    })
  );
}

function closeSocketConnection() {
  store.socket = null;
}

export default store;
export { mapState, sendSocketMessage, closeSocketConnection };
