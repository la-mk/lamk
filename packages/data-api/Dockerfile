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

FROM node:12-slim as prod
WORKDIR /usr/src/app
# Environment variables are not preserved from other build stages, and it is required by the application
ENV NODE_ENV production
# This will copy dev dependencies as well, which is fine for now.
COPY --from=build /usr/src/app/node_modules ./node_modules/
COPY --from=build /usr/src/app/dist ./dist/
ENTRYPOINT ["node", "./dist/index.js"]

# A sample Dockerfile that this is based on: https://github.com/BretFisher/dockercon19