FROM node:10-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
# TODO: This are only for development until we publish them, remove afterwards
COPY ./la-sdk* ./
COPY ./blocks-ui* ./

RUN npm install

COPY . .

RUN if [ "$NODE_ENV" == "development" ]; \ 
  then echo "Running development" ; \
  else npm run build; \
  fi