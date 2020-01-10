#!/bin/bash

xterm -e sudo mongod --auth --port 27017 --bind_ip_all &
#xterm -e sudo mongo --port 27018 &
xterm -e sudo redis-server ./redis/redis.conf --port 6379 #&
#xterm -e sudo redis-cli -p 6379