# Public Chat component + Wordpress hooks

## .env.local

Create the following file .env.local

VITE_PUBLIC_TOKEN='gAAAAABotc_QJlZZsXeET_ORtJabkdds6N71TCI6k6GPxlXZoJWVcG4o6kf7ZW2LL6nNKw2wAS0FFDGfGZiPlWmVf8xpbfm98PV1RNEUoVpm3S1v4t050Scyh_UOY0KROTsv1wKcYi-o3UGbu0JdHqd-UJgaQOcv1Q=='
#VITE_API_BASE_URL='http://localhost:8889'
#VITE_WS_BASE_URL='ws://localhost:8889'
VITE_API_BASE_URL='https://channel.dev.ezeeassist.io'
VITE_WS_BASE_URL='wss://channel.dev.ezeeassist.io'

## Run locally

```shell
conda create -n publicchat nodejs
conda activate publicchat

cd /path/to/wordpress-publicchat
npm install
npm run dev
```
