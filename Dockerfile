FROM node:12-alpine

WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start" ]
