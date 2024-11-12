# Wordpress plugin
made with Vue 3 + TypeScript + Vite

## Install

- `nvm use 18.17.0`
- `npm i`
- `npm run build`

## Dev
- `npm run dev`

## Add build to plugin
- in `main.ts` AND `application-exec.js`, make sure the bot title is correct 
- run `npm run build:prod` - to build the project for `production` mode
- run `pm run build:dev` - to build the project for `develop` mode
- then you can run `npm run preview` to preview the result of created build

 - `npm run build:MODE` will change the Version of the project in `chat-plugin/chat-plugin.php` to patched one

 - `npm run build:MODE` will find API urls in files: `chat-plugin/chat-plugin.php` and 
    `chat-plugin/assets/js/application-exec.js`
    and change it to *https://channel.dev.ezeeassist.io* for dev and *https://channel.prod.ezeeassist.io* for prod

 *MODE* options: `dev`, `prod`
