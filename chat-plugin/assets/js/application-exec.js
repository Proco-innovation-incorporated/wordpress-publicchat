document.addEventListener("DOMContentLoaded", function () {
  window.apiBaseUrl= 'https://channel.dev.ezeeassist.io'
  window.clientEmail = pluginData.clientEmail;
  window.orgToken = pluginData.orgToken;
  window.accessToken = pluginData.accessToken;
  window.refreshToken = pluginData.refreshToken;

  window.setupChatData({
    access_token: `${window.accessToken}`,
    refresh_token: `${window.refreshToken}`,
    org_token: `${window.orgToken}`,
    userEmail: `${window.clientEmail}`,
  });
});
