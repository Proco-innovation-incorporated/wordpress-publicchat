document.addEventListener("DOMContentLoaded", function () {
  window.ezee.setupChatConfig({
    publicToken: pluginData.publicToken,
    wordpressPluginPath: (
      pluginData.pluginBasePath ?
        `${pluginData.pluginBasePath}assets` :
        (
          window.pluginPath || '/wp-content/plugins/chat-plugin/assets'
        )
    ),
  });
  window.ezee.initChat();
});
