document.addEventListener("DOMContentLoaded", function () {
  window.ezee.setupChatConfig({
    publicToken: '<YOUR_EZEE_ASSIST_PUBLIC_TOKEN>',
    botTitle: 'WSI AI Assistant',
    wordpressPluginPath: (
      pluginData.pluginBasePath ?
        `${pluginData.pluginBasePath}assets` :
        (
          window.pluginPath || '/wp-content/plugins/chat-plugin/assets'
        )
    ),
  });
});
