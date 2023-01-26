FROM debian:bullseye-slim as build-jo

WORKDIR /usr/local/src

RUN apt-get -y update && \
    apt-get -y install \
        git \
        make \
        pandoc \
        pkg-config \
        g++ \
        automake \
        autoconf && \
    git clone https://github.com/jpmens/jo.git && \
    cd jo && \
    git checkout 1.9 && \
    autoreconf -i && \
    ./configure && \
    make all


FROM bitnami/nginx:1.23

COPY --from=build-jo /usr/local/src/jo/jo /usr/local/bin
COPY docker/frontend/rootfs /
COPY docker/frontend/docker-entrypoint.d /docker-entrypoint.d

USER poker
WORKDIR /app

COPY --chown=poker:poker packages/frontend .

RUN find . -type f -name "*.tgz" -exec tar xvf {} --strip-components 1 \; -exec rm {} \;
