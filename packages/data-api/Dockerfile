FROM node:14.7.0-alpine as base
ARG GPR_TOKEN

WORKDIR /usr/src/app
COPY package*.json ./
COPY .npmrc ./
# Set the token for the private packages, and once the packages are installed, remove it straight away.
# The token might still leak in the docker history, but it is not a threat for now: https://www.alexandraulsh.com/2018/06/25/docker-npmrc-security/
RUN npm install --silent && rm -f .npmrc

FROM base as dev
ENV NODE_ENV development
CMD ["./entry.dev.sh"]

FROM base as build
COPY . .
# Since we cannot ignore files per stage, we just remove the npmrc here as it will fail due to missing token envvar
RUN rm -f .npmrc
ENV NODE_ENV production
RUN npm run build
RUN npm prune --development

FROM node:14.7.0-alpine as prod
WORKDIR /usr/src/app
# Environment variables are not preserved from other build stages, and it is required by the application
ENV NODE_ENV production
COPY --from=build /usr/src/app/node_modules ./node_modules/
COPY --from=build /usr/src/app/assets ./assets/
COPY --from=build /usr/src/app/dist ./src/
ENTRYPOINT ["node", "./src/index.js"]

# A sample Dockerfile that this is based on: https://github.com/BretFisher/dockercon19