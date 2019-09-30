FROM node:10-alpine as build-stage

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

FROM nginx:1.17-alpine

COPY --from=build-stage /usr/src/app/build /usr/src/backstore
COPY --from=build-stage ./nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx","-g","daemon off;"]