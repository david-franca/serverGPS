#!/bin/bash

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

yarn
npx prisma migrate deploy
yarn build
yarn start:prod
