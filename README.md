# What is this?

This repository simply contains a guide for setting up Futurism, and some extra files needed for doing so. It also contains fixes for certain functionality that was broken in the original version.



## Initial Setup

Download or clone the following repositories:
```
https://github.com/Delphinoid/futurism-shared
https://github.com/Delphinoid/futurism-client
https://github.com/Delphinoid/futurism-multi
https://github.com/Delphinoid/futurism-http
https://github.com/Delphinoid/globe
```
Make sure you put all of these in the same folder, and if you decide to download them as zipped archives please remove -master from the folder names after extracting them as well.

Open up a Bash terminal and type in the following:
```
sudo apt install curl -y
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
nvm install 0.10
```
This will install cURL and Node Version Manager (nvm), which is used to install an older version of Node and Node Package Manager (npm).

After installing npm through nvm, type in the following:
```
npm install bower -g
```
This globally installs Bower. If "npm install bower -g" fails and returns a "missing write access" error, enter the following command and retry:
```
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

Now enter the following commands:
```
sudo apt install git -y
npm install karma-cli -g
npm install grunt-cli -g
```

And finally enter:
```
cd /path/to/futurism-shared
npm install
```
This will install all of the shared dependencies.



## Client Setup

Copy the following files from futurism-shared to futurism-client/src:
```
actions.js
Board.js
cardFns.js
deckFns.js
factions.js
filters.js
futures.js
groups.js
```
And copy this last folder to the main futurism-client directory:
```
node_modules
```

NOTE: You can skip the rest of this step entirely by merging the provided futurism-client folder with Jiggmin's one. These instructions are only included to show how it was done, in case it becomes necessary in the future.

Open up a Bash terminal and enter the following commands:
```
cd /path/to/futurism-client
npm install
npm install jshint-stylish
bower install fastclick
```
This will change the current working directory to futurism-client and install all of the dependencies in package.json and bower.json, as well as some packages that Jiggmin forgot to include in his dependency lists.

At the very bottom of this document is a list of changes to be made to the client. For the site images, resize what is in Jiggmin's repository to 32x32 (preferably with Nearest Neighbour) and add "-32x32" to the file names.

We should be able to test it now. Just enter the following command:
```
npm start
```
If this works, go to futurism-client, right-click and select "Show Hidden" in the context menu. Then merge the futurism-client/.tmp/data with futurism-client/src/data and futurism-client/.tmp/styles with futurism-client/src/styles.



## Server Setup

Copy the following files and folders from futurism-shared to futurism-http/shared:
```
models
factions.js
futures.js
globe.js
groups.js
redisConnect.js
redisSession.js
```
And copy the following files and folders from futurism-shared to futurism-multi/shared:
```
models/Card.js
models/Deck.js
models/Progress.js
models/Record.js
actions.js
Board.js
cardFns.js
factions.js
filters.js
futures.js
globe.js
groups.js
redisConnect.js
redisSession.js
```
Then just copy this last folder to the main futurism-multi and futurism-http directories:
```
node_modules
```

After copying these files and folders, open up a Bash terminal and type in the following commands:
```
cd /path/to/futurism-multi
npm install
```
This will install all of the dependencies in package.json and bower.json that are required for futurism-multi.

Now do the same but for futurism-http:
```
cd /path/to/futurism-http
npm install
```

And once again for globe:
```
cd /path/to/globe
npm install
```

After running npm install in futurism-multi, merge the futurism-multi/node_modules folder in this repository with the one you have. A file from one of the dependencies seems to produce an error, so a fixed version has been provided.



## Database Setup

Now we should install MongoDB and Redis. We need fairly old versions of both of these. We'll start by getting MongoDB. You can find a list of Linux binaries here:
```
https://www.mongodb.org/dl/linux/
```
There is also a list of Windows binaries here, but this guide will be written for Linux only:
```
https://www.mongodb.org/dl/win32/
```
Any version <= 2.6 should be compatible with the Node.js MongoDB driver that Futurism uses, but only version 2.2.7 has been tested. When it has downloaded, extract the binaries from the archive.

With that done, we can configure MongoDB. First, run the following command to set up the database directory:
```
sudo mkdir -p /data/db
```
From now on, to start MongoDB, all we have to do is execute this command:
```
sudo /path/to/mongod --auth --port port --bind_ip address1,address2,...
```
Where port is the port to host on and address1,address2,... are the addresses to bind to. /path/to is the path to your MongoDB binaries, which should be the bin subdirectoy of the folder downloaded previously. Note that by default it will only bind to the loopback address. The default port is 27017. To shutdown MongoDB, execute these (closing the terminal window is not enough):
```
sudo /path/to/mongo --port port
use admin
db.auth("admin", "pass")
db.shutdownServer()
exit
```

We can now set up the database as required by Futurism. Start the server with the command above, and follow the instructions below. If you are using a version below v2.6, do the following:
```
sudo /path/to/mongo
use admin
db.addUser("admin", "pass", false)
db.auth("admin", "pass")
use futurism
db.addUser("admin", "pass", false)
use globe
db.addUser("admin", "pass", false)
```
Otherwise use this:
```
sudo /path/to/mongo
use admin
db.createUser({ user: "admin", pwd: "pass", roles: [ "root" ] })
db.auth("admin", "pass")
use futurism
db.createUser({ user: "admin", pwd: "pass", roles: [ "dbOwner" ] })
use globe
db.createUser({ user: "admin", pwd: "pass", roles: [ "dbOwner" ] })
```
Note that in this example, futurism-development is the name of Futurism's database and globe is the name of globe's database. We have also created users in these databases (as well as MongoDB's administration "database"). These do not need to have the same credentials. "admin" and "pass" are the username and password used for authentication when connecting to these databases. If you want, you can remove users with the following commands:
```
sudo /path/to/mongo
use admin
db.auth("admin", "pass")
use futurism-development
db.dropUser("admin")
```
Where "admin" and "pass" are once again the username and password MongoDB is using for authentication. To show a list of collections in a particular database, as well as the documents in the collection, you can use the following commands:
```
sudo /path/to/mongo
use admin
db.auth("admin", "pass")
use globe
show collections
db.users.find()
```
Where show collections will show a list of all collections on the globe database, and db.users.find() lists all of the documents in the users collection.

Redis v2.8.9 seems to be the version Jiggmin used. You can use the version provided in this repository, or download it here:
```
http://download.redis.io/releases/
```
After downloading Redis, we'll have to install and configure it. Decompress the archive and type in the following commands:
```
cd /path/to/redis
make
```
This will build Redis. Once that has finished, go to the src folder in your Redis directory and copy the following files to your /bin folder:
```
redis-benchmark
redis-check-aof
redis-check-dump
redis-cli
redis-sentinel
redis-server
```
Now open up redis.conf in your Redis directory and add the following line (preferably after line 339):
```
requirepass pass
```
Where pass is the password you want Redis to use for authentication. The username will be admin. After modifying redis.conf, put it in a folder named redis in the directory containing futurism-http, futurism-multi and globe.

From now on, to start Redis, all we have to do is execute this command:
```
sudo /path/to/redis-server /path/to/redis.conf --port port
```
Where port is the port to host on: the default is 6379. /path/to is the path to your Redis binaries, which should be the bin subdirectoy of the folder downloaded previously. To shutdown Redis, execute these (closing the terminal window is not enough):
```
/path/to/redis-cli -h host -p port
AUTH pass
shutdown
exit
```
Where host is the host address (you may remove the -h option entirely if hosting locally), port is the redis-server port and pass is the password Redis is using for authentication. The Redis client (redis-cli) can also be used to monitor redis-server.
	
Now merge the provided futurism-http folder with your own. This adds some required files and fixes some that are broken. One file in particular, env.js, still needs configuring, however.

I've included some base env.js files for you to use, but they still require some modification. For each one (globe/server/config/env.js, futurism-http/config/env.js and futurism-multi/config/env.js), change admin and pass in process.env.MONGO_URI and process.env.REDIS_URI to whatever you used for MongoDB and Redis authentication (the default username for Redis is admin), and change database in process.env.MONGO_URI to the name of the database you want to use (e.g. futurism-development for futurism-http and futurism-multi, and globe for globe). If you do not use the default ports for MongoDB and Redis (27017 and 6379 respectively), you will have to change them here too. Then just merge them with their respective folders.

In order to set up alternative lobbies and game servers, modify process.env.GAME_SERVERS in futurism-http's env.js to be a comma-separated list of servers. For example:
```
process.env.GAME_SERVERS = 'http://localhost:9100/,http://localhost:9101/,http://localhost:9102/';
```
You can then modify the lobby definitions in futurism-http/config/defaultLobbies.js, or potentially on the database. Server indices start on 1 (so server: 1 refers to the first server in process.env.GAME_SERVERS, not the second). These addresses are served to the client. Therefore they must be publicly-accessible addresses, and not local addresses such as localhost.

Finally, create a folder named client in futurism-http and put everything in futurism-client/src into it.



## Starting the Server

Open runServer.sh and modify lines 3-5 to use the actual paths to node and npm on your system (I've left my paths in as an example). You can also change the default port and bind addresses in both runDatabase.sh and runServer.sh. Then just put them directory containing your futurism-http, futurism-multi, globe and redis folders and run them with the following commands:
```
cd /path/to/runServer.sh
sudo ./runDatabase.sh
sudo ./runServer.sh
```
If it doesn't work, try executing these commands and retrying:
```
chmod +x runDatabase.sh
chmod +x runServer.sh
```
Please give the databases time to start before starting globe, multi and http.



## Changelist

```
futurism-client/src/index.html
	Line 120
		- <script src="bower_components/angular-truncate/dist/angular-truncate.js"></script>
		+ <script src="bower_components/angular-truncate/src/truncate.js"></script>

futurism-client/src/views/game.html
	Line 69
		- <li ng-repeat="card in hand.cards">
		+ <li ng-repeat="card in players.findMe().hand">
	Line 82
		- <li ng-repeat="future in hand.futures track by $index">
		+ <li ng-repeat="future in players.findMe().futures track by $index">
	
futurism-client/src/views/card-display.html
	Line 34
		- <div class="card-pride">{{card.pride}} ₱</div>
		+ <div class="card-pride">{{(card.pride != undefined ? card.pride : (card.abilities.length + 1*card.attack + 1*card.health))}} ₱</div>

futurism-client/src/images/sites/a-32x32.png
futurism-client/src/images/sites/f-32x32.png
futurism-client/src/images/sites/g-32x32.png
futurism-client/src/images/sites/j-32x32.png
futurism-client/src/images/sites/k-32x32.png
futurism-client/src/images/sites/n-32x32.png

futurism-http/fns/mongoose/validatedUpdate.js
	= globe/server/fns/mongoose/validatedUpdate.js

futurism-http/routes/records.js
	Line 1
		+ (function(){
	Line 25
		+ module.exports = self; }());

futurism-http/middleware/proxy.js
	Line 15
		- proxy.web(req, res, {target: targetUri, secure: secure});
		+ proxy.web(req, res, {target: targetUri, secure: secure, xfwd: true});
```