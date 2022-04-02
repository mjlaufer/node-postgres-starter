FROM node:16.14-alpine3.14 as builder-dev

WORKDIR /usr/src/app
COPY package.json yarn.lock .
RUN yarn install
COPY . .

FROM builder-dev
RUN yarn build

USER node
CMD ["yarn", "start"]
