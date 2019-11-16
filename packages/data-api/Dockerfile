FROM node:12-slim

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json package-lock.json .npmrc ./
RUN npm install  && npm cache clean --force

COPY . .

# An Dockerfile that can be used when going to prod is https://github.com/BretFisher/dockercon19