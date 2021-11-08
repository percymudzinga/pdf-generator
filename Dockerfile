FROM ubuntu
FROM node:16-alpine
RUN apk add chromium
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node
COPY package.json ./
USER node
RUN npm install
COPY --chown=node:node . .
CMD [ "node", "app.js"]