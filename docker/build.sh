#!/bin/bash

set -ex

PACKAGES=("backend" "frontend")

for package in "${PACKAGES[@]}"; do
    docker buildx build . \
        -t "ghcr.io/axelrindle/planningpoker/$package" \
        -f "docker/$package/Dockerfile"
    docker push "ghcr.io/axelrindle/planningpoker/$package"
done
