FROM node:14.13.1-alpine as base
ARG GPR_TOKEN

WORKDIR /usr/src/app
COPY package*.json ./
# COPY patches/* ./patches/
COPY .npmrc ./
# Set the token for the private packages, and once the packages are installed, remove it straight away.
# The token might still leak in the docker history, but it is not a threat for now: https://www.alexandraulsh.com/2018/06/25/docker-npmrc-security/
# We need --unsafe-perm for the patch-package to run, add when needed
RUN npm install --silent  && rm -f .npmrc

FROM base as dev
ENV NODE_ENV development
CMD ["./entry.dev.sh"]

FROM base as build
COPY . .
# Since we cannot ignore files per stage, we just remove the npmrc here as it will fail due to missing token envvar
RUN rm -f .npmrc
ENV NODE_ENV production
RUN npm run build

FROM nginx:1.17-alpine as prod
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./entry.sh ./
COPY --from=build /usr/src/app/build ./

ENTRYPOINT ["./entry.sh"]
CMD ["nginx", "-g", "daemon off;"]