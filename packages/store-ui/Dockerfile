FROM node:12-slim

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json package-lock.json .npmrc ./
RUN npm install  && npm cache clean --force

COPY . .

# RUN if [ "$NODE_ENV" == "development" ]; \ 
#   then echo "Running development" ; \
#   else npm run build; \
#   fi