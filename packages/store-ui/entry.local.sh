#!/bin/sh
set -e

# When we run `npm install` or `npm run dev` the user is switched to `nobody`, and it can't read package.json or package-lock.json as a consequence. For development we can just run with unsafe-perm;
# npm config set unsafe-perm true

# This is the dev tracking ID
export NEXT_PUBLIC_ANALYTICS_TRACKING_ID='90f6dff8cd68254f0bcdedcc33ab7a14'
export NEXT_PUBLIC_API_ENDPOINT='https://api.la.mk'
export NEXT_PUBLIC_ARTIFACTS_ENDPOINT='https://artifacts.la.mk'
export NEXT_PUBLIC_IMAGES_PROXY_ENDPOINT='https://artifacts.la.mk'
export NEXT_PUBLIC_NESTPAY_GATEWAY_ENDPOINT='https://epay3.halkbank.mk/fim/est3Dgate'
export NEXT_PUBLIC_STATIC_STORE_URL='www.mokudo.la.mk'
export NEXT_PUBLIC_UI_TEMPLATE='elegant'
export NEXT_PUBLIC_NODE_ENV='development'

export NODE_ENV='development'
export PORT=8080

yarn run dev
# yarn run build && yarn start