# Wordpress plugin
made with Vue 3 + TypeScript + Vite

## Install

- nvm use 18.17.0
- npm i
- npm run build

## Dev
npm run dev

## Add build to plugin
- in `main.ts` AND `application-exec.js`, make sure the bot title is correct 
- make sure that `window.apiBaseUrl` in the file `main.ts` is set to an empty string
- livechat\dist\assets move to livechat\chat-plugin\assets to css and js folder nedeed files
- change name from hash to widget-app.js and widget-style.css
- make zip for chat plugin folder 
- install to site
