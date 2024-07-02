document.addEventListener("DOMContentLoaded", function () {
  window.apiBaseUrl = 'https://channel.dev.ezeeassist.io';
  window.pluginPath = pluginData.pluginBasePath
    ? `${pluginData.pluginBasePath}assets`
    :  window.pluginPath || '/wp-content/plugins/chat-plugin/assets';
  window.clientEmail = pluginData.clientEmail;
  window.orgToken = pluginData.orgToken;
  window.accessToken = pluginData.accessToken;
  window.refreshToken = pluginData.refreshToken;
  window.botTitle = 'WSI AI Assistant';

  window.setupChatData({
    access_token: `${window.accessToken}`,
    refresh_token: `${window.refreshToken}`,
    org_token: `${window.orgToken}`,
    userEmail: `${window.clientEmail}`,
  });
});
