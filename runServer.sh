#!/bin/bash

xterm -e sudo mongod --auth &
xterm -e sudo mongo &
xterm -e sudo redis-server ./redis/redis.conf &
xterm -e sudo redis-cli &
xterm -e /home/dannypc/.nvm/v0.10.47/bin/node ./globe/server/testServer.js &
xterm -e /home/dannypc/.nvm/v0.10.47/bin/npm --prefix ./futurism-multi start &
xterm -e /home/dannypc/.nvm/v0.10.47/bin/npm --prefix ./futurism-http start