FROM node:18.4.0-alpine as base
ARG GPR_TOKEN

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
# COPY patches/* ./patches/
COPY .npmrc ./

# Set the token for the private packages, and once the packages are installed, remove it straight away.
# The token might still leak in the docker history, but it is not a threat for now: https://www.alexandraulsh.com/2018/06/25/docker-npmrc-security/\
# We need --unsafe-perm for the patch-package to run, add when needed
RUN yarn install --frozen-lockfile --ignore-engines --silent && yarn cache clean && rm -f .npmrc

FROM base as dev
ENV NODE_ENV development
CMD ["./entry.dev.sh"]

FROM base as build
WORKDIR /usr/src/app
COPY . .
# Since we cannot ignore files per stage, we just remove the npmrc here as it will fail due to missing token envvar
RUN rm -f .npmrc
ENV NODE_ENV production
RUN yarn run build
# TODO: It's somewhat confusing what should and shouldn't be a dev dependency, so let's just keep all of them for now
# RUN npm prune --development

FROM node:18.4.0-alpine as prod
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY ./entry.sh ./
COPY --from=build /usr/src/app/. ./

ENTRYPOINT ["./entry.sh"]
# TODO: Un-hardcode port here
CMD ["node_modules/.bin/next", "start", "-p", "80"]