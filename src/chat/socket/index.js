import {ref} from "vue";
import {closeSocketConnection} from "../store/index.js";
import {emitter} from "../event/index.js";

export const createSocketConnection = (params) => {
  const {
    access_token,
    refresh_token,
    userEmail,
    org_token
  } = params

  const tokens = ref({
    access_token: import.meta.env.MODE === 'development' ? localStorage.getItem('access_token') || access_token : access_token,
    refresh_token: import.meta.env.MODE === 'development' ? localStorage.getItem('refresh_token') || refresh_token : refresh_token
  })

  const refresh = async () => {
    try {
      const result = await fetch(`${window.apiBaseUrl}/api/auth/token/refresh?refresh_token=${tokens.value.refresh_token}`)
        .then(i => i.json())
      if( import.meta.env.MODE === 'development' && result?.access_token && result?.refresh_token) {
        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('refresh_token', result.refresh_token)
      }

      tokens.value = result;
    } catch (e) {
      if( import.meta.env.MODE === 'development') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    }
  }
  const auth = async () => {
    await refresh()

    return createConnection();
  }



  const createIntervalBeforeRefresh = (socket) => {
    const interval = setInterval(() => {
      closeSocketConnection()
      socket.close()
      refresh()
      clearInterval(interval)
    }, 1000 * 60 * 9)
  }

  const createConnection = () => {
    const socket = new WebSocket(
      `${window.apiBaseUrl}/api/livechat/in/${org_token}?token=${tokens.value.access_token}`
    );

    socket.onopen = function(e) {
      setTimeout(() => {
        store.setState('loadedConnection', true)
      }, 1000)
      console.log("[socket] connected");
      store.setSocket(socket, userEmail)
    };

    socket.onmessage = function(event) {
      console.log(`[socket] get message from server: ${event.data}`);
      emitter.$emit('onmessage', JSON.parse(event.data))
    };

    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[close] connection closed clearly, code=${event.code} message=${event.reason}`);
      } else {
        // например, сервер убил процесс или сеть недоступна
        // обычно в этом случае event.code 1006
        console.log('[close] connection closed dirty ', event.code);
      }
    };

    socket.onerror = function(error) {
      console.log(`[error]`, error);
    };

    createIntervalBeforeRefresh(socket)
    return socket;
  }

  return auth();
}
