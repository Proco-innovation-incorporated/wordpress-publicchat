import store, { mapState }  from "../store/index.js";
import { emitter } from "../event/index.js";
import { ErrorTypes } from "../../error.js";

const backoffFactor = 0.1;
const maxBackoffSleep = 10; // seconds

let socket;
let connectAttempt = 0;

export const reconnect = (connectNow=false) => {
  store.setState("loadedConnection", false);
  store.setState("error", null);

  if (connectNow) {
    createSocketConnection();
  }
  else {
    const sleepFor = Math.min(
      backoffFactor * Math.pow(2, connectAttempt),
      maxBackoffSleep
    );
    console.log("Backing off before retrying Websocket connection", connectAttempt, sleepFor);
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        console.log("Retrying Websocket connection");
        resolve("");
      }, sleepFor);
    });
    promise.then(createSocketConnection);
  }
}

export const createSocketConnection = () => {
  const createConnection = () => {
    if (socket) {
      socket.close();
      socket = null;
    }

    const { chatConfig } = mapState(["chatConfig"]);
    store.setState("connecting", true);
    socket = new WebSocket(
      `${chatConfig.value.wsBaseUrl}/api/publicchat/in?token=${chatConfig.value.publicToken}&session_id=${store.state.value.sessionId}`
    );
    connectAttempt++;

    socket.onopen = function (e) {
      setTimeout(() => {
        store.setState("loadedConnection", true);
        store.setState("connecting", false);
      }, 1000);
      console.debug("[socket] Connected");
      store.setSocket(socket);
      connectAttempt = 0;
    };

    socket.onmessage = function (event) {
      try {
        const msg = JSON.parse(event.data);
        console.debug(
          `[socket] Received Message: ${JSON.stringify(msg, null, 2)}`
        );
        emitter.$emit("onmessage", msg);
      } catch (error) {
        console.error(
          `[socket] Error receiving Message: ${error.message}\noriginal message: ${event.data}`
        );
      }
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        store.setState("error", 1005);
        console.debug(
          `[close] Connection cleanly closed. code=${event.code} message=${event.reason}`
        );
      } else {
        // for example, the server killed the process or the network is unavailable
        // usually in this case event.code 1006
        store.setState("error", 1001);
        console.error(
          "[close] Error cleanly closing Connection",
          event.code,
          event.reason
        );
        //throw new Error(ErrorTypes["1001"]);
      }
      // emitting new event so that the interface can update itself
      emitter.$emit("connection-close");
      reconnect();
    };

    socket.onerror = function (error) {
      store.setState("error", 1004);
      console.error(`[error]`, error);
      store.setState("loadedConnection", true);
      //throw new Error(ErrorTypes["1004"]);
    };

    return socket;
  };

  return createConnection();
};
