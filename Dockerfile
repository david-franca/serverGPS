## Comando obrigatório
## Baixa a imagem do node com versão alpine (versão mais simplificada e leve)
FROM node:alpine

RUN apk add --no-cache bash git yarn

RUN npm i -g @nestjs/cli@7.6.0

USER node

WORKDIR /home/node/app