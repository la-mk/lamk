FROM node:12-slim as base
ARG GPR_TOKEN

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
# Set the token for the private packages, and once the packages are installed, remove it straight away.
# The token might still leak in the docker history, but it is not a threat for now: https://www.alexandraulsh.com/2018/06/25/docker-npmrc-security/
RUN echo "//npm.pkg.github.com/:_authToken=$GPR_TOKEN \n @sradevski:registry=https://npm.pkg.github.com" > .npmrc && \
    npm ci && \
    rm -f .npmrc

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