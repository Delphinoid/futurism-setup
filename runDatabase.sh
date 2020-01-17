#!/bin/bash

xterm -e sudo ./mongodb/bin/mongod --auth --port 27017 --bind_ip_all &
#xterm -e sudo ./mongodb/bin/mongo --port 27018 &
xterm -e sudo ./redis/bin/redis-server ./redis/redis.conf --port 6379 #&
#xterm -e sudo ./redis/bin/redis-cli -p 6379