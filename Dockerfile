FROM node:12-alpine as builder-dev

WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

FROM builder-dev
RUN yarn build

EXPOSE 5000
CMD [ "yarn", "start" ]
