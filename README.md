# Public Chat component + Wordpress hooks

This is the baseline Public Chat Client made available to enable EZee Assist customers to adapt for their needs

## .env.local

Create the .env.local file with the following structure. You should already have values for the following variables

```
VITE_PUBLIC_TOKEN=
VITE_API_BASE_URL=
VITE_WS_BASE_URL=
```


## Run locally

```shell
conda create -n publicchat nodejs
conda activate publicchat

cd /path/to/wordpress-publicchat
npm install
npm run dev
```
