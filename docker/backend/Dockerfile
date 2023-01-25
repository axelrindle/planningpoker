FROM node:18-alpine

RUN adduser -s /bin/bash -D -h /app poker && \
    chown poker:poker /app && \
    chmod 750 /app && \
    npm i -g npm

USER poker
WORKDIR /app

COPY --chown=poker:poker packages/backend/ .
COPY --chown=poker:poker node_modules .

ENV NODE_CONFIG_DIR=/config
VOLUME /config
VOLUME /data

CMD npx tsx src/index.ts
