FROM alpine:3.6
FROM node:16-alpine

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node
COPY package.json ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

USER node
RUN npm install
COPY --chown=node:node . .
CMD [ "node", "app.js"]