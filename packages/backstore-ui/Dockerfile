FROM node:12-slim as build-stage

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json package-lock.json .npmrc ./
RUN npm install
# RUN npm ci && npm cache clean --force

COPY . .

# RUN if [ "$NODE_ENV" == "development" ]; \ 
#   then echo "Running development" ; \
#   else npm run build; \
#   fi

# FROM nginx:1.17-alpine

# COPY --from=build-stage /usr/src/app/build /usr/src/backstore
# COPY --from=build-stage ./nginx.conf /etc/nginx/conf.d/default.conf
# ENTRYPOINT ["nginx","-g","daemon off;"]