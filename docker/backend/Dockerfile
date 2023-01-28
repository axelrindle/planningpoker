FROM node:18-alpine

RUN adduser -s /bin/bash -D -h /app poker && \
    mkdir /data /config && \
    chown poker:0 /app /data /config && \
    chmod -R g=u /app /data /config && \
    npm i -g npm

USER poker
WORKDIR /app

COPY --chown=poker:poker packages/backend .
RUN npm i

ENV NODE_CONFIG_DIR=/app/config:/config
ENV PP_DATA_DIRECTORY=/data
VOLUME /data
VOLUME /config

CMD node build/index.mjs
