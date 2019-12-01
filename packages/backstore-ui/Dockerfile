FROM node:12-slim as base
WORKDIR /usr/src/app
COPY package.json package-lock.json .npmrc ./
RUN npm ci && npm cache clean --force

FROM base as dev
ENV NODE_ENV development
CMD ["npm", "run", "dev"]

FROM base as build
COPY . .
ENV NODE_ENV production
RUN npm run build

FROM nginx:1.17-alpine as prod
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/build ./
ENTRYPOINT ["nginx","-g","daemon off;"]