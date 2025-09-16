/* eslint-disable import/order */

import VTooltip from "v-tooltip";
import { createApp } from "vue"
import styles from "./style.css?inline"
import App from "./App.vue"
import Launcher from "./chat/Launcher.vue";
import store from "./chat/store"
import "./chat/socket"
declare const window: any;
(function (){
  const isDevMode: boolean = import.meta.env.MODE === "development";

  window.ezee = window.ezee || {};

  store.setupFirst();
  window.ezee.setupChatConfig = (props: any = {}) => {
    const config = {
      ...{
        publicToken: undefined,
        botTitle: "Ezee Assist Public Agent",
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
        wsBaseUrl: import.meta.env.VITE_WS_BASE_URL,
        wordpressPluginPath: "",
        enableAttachments: false,
      },
      ...props,
    };
    console.log(config);

    if (!config.publicToken) {
      throw new Error("Ezee Assist Public Agent requires a Public Token");
    }
  
    store.setState("chatConfig", {
      ...config
    });
  };

  if (isDevMode && import.meta.env.VITE_PUBLIC_TOKEN) {
    window.ezee.setupChatConfig({
      publicToken: import.meta.env.VITE_PUBLIC_TOKEN,
    });
  }

  // TODO set class and id
  const shadowRoot = document.createElement("div");
  shadowRoot.style.position = "absolute";
  shadowRoot.style.zIndex = "100000000000000000";
  document.body.append(shadowRoot);
  if(shadowRoot) {
    const shadow = shadowRoot.attachShadow({mode: "open"});
    const style = document.createElement("style");
    const chat = document.createElement("div"); // TODO set class
    chat.id = "chat";
    style.textContent = styles;
    shadow.appendChild(style);
    shadow.appendChild(chat);
    createApp(App)
      .component("BubbleChat", Launcher)
      .use(VTooltip)
      .mount(chat);
  }
})();
