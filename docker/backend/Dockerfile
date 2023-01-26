FROM node:18-alpine

RUN adduser -s /bin/bash -D -h /app poker && \
    mkdir /data /config && \
    chown poker:poker /app /data /config && \
    chmod 750 /app /data /config && \
    npm i -g npm

USER poker
WORKDIR /app

COPY  --chown=poker:poker packages/backend .
RUN npm i

ENV NODE_CONFIG_DIR=/config
VOLUME /data
VOLUME /config

CMD node dist/index.mjs
