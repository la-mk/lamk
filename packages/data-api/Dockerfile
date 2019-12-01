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

FROM node:12-slim as prod
WORKDIR /usr/src/app
# Environment variables are not preserved from other build stages, and it is required by the application
ENV NODE_ENV production
COPY --from=build /usr/src/app/node_modules ./node_modules/
COPY --from=build /usr/src/app/dist ./dist/
ENTRYPOINT ["node", "./dist/index.js"]

# An Dockerfile that can be used when going to prod is https://github.com/BretFisher/dockercon19