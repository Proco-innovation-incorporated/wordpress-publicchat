import store, { mapState }  from "../store/index.js";
import { emitter } from "../event/index.js";
import { ErrorTypes } from "../../error.js";
let socket;

export const createSocketConnection = () => {
  const createConnection = () => {
    if (socket) {
      socket.close();
      socket = null;
    }

    const { chatConfig } = mapState(["chatConfig"]);
    socket = new WebSocket(
      `${chatConfig.value.wsBaseUrl}/api/publicchat/in?token=${chatConfig.value.publicToken}&session_id=${store.state.value.sessionId}`
    );

    socket.onopen = function (e) {
      setTimeout(() => {
        store.setState("loadedConnection", true);
      }, 1000);
      console.log("[socket] connected");
      store.setSocket(socket);
    };

    socket.onmessage = function (event) {
      try {
        const msg = JSON.parse(event.data);
        console.log(
          `[socket] get message from server: ${JSON.stringify(msg, null, 2)}`
        );
        emitter.$emit("onmessage", msg);
      } catch (error) {
        console.error(
          `[socket] error on message: ${error.message}\noriginal message: ${event.data}`
        );
      }
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        store.setState("error", 1005);
        console.log(
          `[close] connection closed clearly, code=${event.code} message=${event.reason}`
        );
      } else {
        // for example, the server killed the process or the network is unavailable
        // usually in this case event.code 1006
        store.setState("error", 1001);
        console.error(
          "[close] connection closed dirty ",
          event.code,
          event.reason
        );
        throw new Error(ErrorTypes["1001"]);
      }
      // emitting new event so that the interface can update itself
      emitter.$emit("connection-close");
    };

    socket.onerror = function (error) {
      store.setState("error", 1004);
      console.error(`[error]`, error);
      store.setState("loadedConnection", true);
      throw new Error(ErrorTypes["1004"]);
    };

    return socket;
  };

  return createConnection();
};
