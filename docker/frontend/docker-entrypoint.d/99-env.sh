#!/bin/sh

# https://gist.github.com/judy2k/7656bfe3b322d669ef75364a46327836
if test -f ".env"; then
    export "$(grep -E -v '^#' .env | xargs)"
fi

# only include variables starting with REACT_APP_
VARIABLES=$(env | grep REACT_APP_)
OBJECT=$(jo -e "$VARIABLES")

if [ "$OBJECT" = "" ]; then
    OBJECT="{}"
fi

echo "window.__RUNTIME_CONFIG__ = $OBJECT;" > "/app/build/runtime-env.js"
