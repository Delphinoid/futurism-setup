#!/bin/bash

xterm -e ~/.nvm/v0.10.47/bin/node ./globe/server/testServer.js &
xterm -e ~/.nvm/v0.10.47/bin/npm --prefix ./futurism-multi start &
xterm -e ~/.nvm/v0.10.47/bin/npm --prefix ./futurism-http start