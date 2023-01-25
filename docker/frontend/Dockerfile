FROM nginx:alpine

RUN apk add --no-cache jo

COPY docker/frontend/rootfs /
COPY docker/frontend/docker-entrypoint.d /docker-entrypoint.d

RUN adduser -s /bin/bash -D -h /app poker && \
    chown poker:poker /app && \
    chmod 750 /app

USER poker
WORKDIR /app

COPY --chown=poker:poker packages/frontend/*.tgz .

RUN find . -type f -name "*.tgz" -exec tar xvf {} --strip-components 1 \; -exec rm {} \;
