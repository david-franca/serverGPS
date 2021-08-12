FROM node:alpine

RUN apk add --no-cache bash git yarn

RUN npm i -g @nestjs/cli@7.6.0 && npm install pm2 -g

USER node

WORKDIR /home/node/app