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

USER 0

COPY --from=build-jo /usr/local/src/jo/jo /usr/local/bin
COPY docker/frontend/rootfs /
COPY --chown=1001:0 packages/frontend/build /app

RUN chown -R 1001:0 /app && \
    chmod -R g=u /app

USER 1001
WORKDIR /app
