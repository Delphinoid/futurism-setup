## What is this?

This repository simply contains a guide for setting up Futurism, and some extra files needed for doing so.



## Initial Setup

Download or clone the following repositories:
	https://github.com/Jiggmin/futurism-shared
	https://github.com/Jiggmin/futurism-client
	https://github.com/Jiggmin/futurism-multi
	https://github.com/Jiggmin/futurism-http
	https://github.com/Jiggmin/globe
Make sure you put all of these in the same folder, and if you decide to download them as zipped archives please remove -master from the folder names after extracting them as well.

Open up a Bash terminal and type in the following:
	sudo apt install curl -y
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
	nvm install 0.10
This will install cURL and Node Version Manager (nvm), which is used to install an older version of Node and Node Package Manager (npm).

After installing npm through nvm, type in the following:
	npm install bower -g
This globally installs Bower. If "npm install bower -g" fails and returns a "missing write access" error, enter the following command and retry:
	sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

Now enter the following commands:
	sudo apt install git -y
	npm install karma-cli -g
	npm install grunt-cli -g

And finally enter:
	cd /path/to/futurism-shared
	npm install
This will install all of the shared dependencies.



## Client Setup

NOTE: You can skip this step entirely by merging the provided futurism-client folder with Jiggmin's one. These instructions are only included to show how it was done, in case it becomes necessary in the future.

Open up a Bash terminal and enter the following commands:
	cd /path/to/futurism-client
	npm install
	npm install jshint-stylish
	bower install fastclick
This will change the current working directory to futurism-client and install all of the dependencies in package.json and bower.json, as well as some packages that Jiggmin forgot to include in his dependency lists.

Now you have a choice. You can either open futurism-client/src/index.html in a text editor and change line 120 to the following:
	<script src="bower_components/angular-truncate/src/truncate.js"></script>
Or you can go to futurism-client/src/bower-components/angular-truncate/ and copy the src folder, rename it dist, and then rename futurism-client/src/bower-components/angular-truncate/dist/truncate.js to angular-truncate.js.

One last thing Jiggmin seems to have forgotten are the 32x32 site icons. Go to futurism-client/src/images/sites and make copies of all the images, but add -32x32 to their names. Then just resize them to 32x32 and you should be done. Make sure to set the resampling method to "Nearest Neighbour" so the result isn't blurry though.

We should be able to test it now. Just enter the following command:
	npm start
If this works, go to futurism-client, right-click and select "Show Hidden" in the context menu. Then merge the futurism-client/.tmp/data with futurism-client/src/data and futurism-client/.tmp/styles with futurism-client/src/styles.



## Server Setup

Copy the following files and folders from futurism-shared to futurism-multi/shared and futurism-http/shared:
	- models
	- spec
	- actions.js
	- Board.js
	- cardFns.js
	- deckFns.js
	- factions.js
	- filters.js
	- futures.js
	- globe.js
	- groups.js
	- redisConnect.js
	- redisSession.js
And copy this last folder to the main futurism-multi and futurism-http directories:
	- node_modules

After copying these files and folders, open up a Bash terminal and type in the following commands:
	cd /path/to/futurism-multi
	npm install
This will install all of the dependencies in package.json and bower.json that are required for futurism-multi.

Now do the same but for futurism-http:
	cd /path/to/futurism-http
	npm install

And once again for globe:
	cd /path/to/globe
	npm install

Now we should install MongoDB and Redis. Just type in the following to install MongoDB:
	sudo apt-get install redis-server
Downloading and building Redis yourself instead of using apt-get install is actually a lot easier. I'm using Redis v2.8.9 (a very old version), which seems to be the version Jiggmin used. You can download it here:
	http://download.redis.io/releases/

After downloading Redis, we'll have to install and configure it. Type in the following commands:
	cd /path/to/Redis
	make
This will build Redis. Once that has finished, go to the src folder in your Redis directory and copy the following files to your /bin folder:
	- redis-benchmark
	- redis-check-aof
	- redis-check-dump
	- redis-cli
	- redis-sentinel
	- redis-server
Now open up redis.conf in your Redis directory and add the following line (preferably after line 339):
	requirepass pass
Where pass is the password you want Redis to use for authentication. The username will be admin. After modifying redis.conf, put it in a folder named redis in the directory containing futurism-http, futurism-multi and globe.

From now on, to start Redis, all we have to do is execute this command:
	sudo redis-server /path/to/Redis/redis.conf
To shutdown Redis, execute these (closing the terminal window is not enough):
	redis-cli
	AUTH pass
	shutdown
	exit
Where pass is the password Redis is using for authentication.

Now we can move onto configuring MongoDB. We have to start it first, so type in the following command:
	sudo mongod
If this doesn't work, create the /data/db directory that MongoDB expects and try again. When it's running, open a new terminal and type in the following:
	mongo
	use admin
	db.createUser({ user: "admin", pwd: "pass", roles: [ "root" ] })
	use futurism-development
Where "admin" and "pass" are the username and password used for authentication. If you want, you can remove the user with the following commands:
	mongo
	use admin
	db.auth("admin", "pass")
	db.dropUser("admin")
Where "admin" and "pass" are once again the username and password MongoDB is using for authentication.

From now on, to start MongoDB, all we have to do is execute this command:
	sudo mongod --auth
To shutdown MongoDB, execute these (closing the terminal window is not enough):
	mongo
	use admin
	db.auth("admin", "pass")
	db.shutdownServer()
	exit

Once all of that is done, there's one file we'll have to change. If you merged the provided futurism-http with your own, you can skip this step. Open up futurism-http/routes/records.js and add the following line to the beginning:
	(function() {
Then add the following lines to the end:
	module.exports = self;
	}());
	
Now we'll need to fill in some missing files. Once again, if you merged the provided futurism-http with your own, you can skip this step. Go to globe/server/fns/mongoose and copy validatedUpdate.js to futurism-http/fns/mongoose.

Another missing file is env.js. I've included some base env.js files for you to use, but they still require some modification. For each one (globe/server/config/env.js, futurism-http/config/env.js and futurism-multi/config/env.js), change admin and pass in process.env.MONGO_URI and process.env.REDIS_URI to whatever you used for MongoDB and Redis authentication (the default username for Redis is admin), and change database in process.env.MONGO_URI to the name of the database you want to use (if you're lazy, admin works). Then just merge them with their respective folders.

Finally, create a folder named client in futurism-http and put everything in futurism-client/src into it.



## Starting the Server

Put runServer.sh in the directory containing your futurism-http, futurism-multi, globe and redis folders and run it with the following commands:
	cd /path/to/runServer.sh
	sudo ./runServer.sh
If it doesn't work, try executing this command and retrying:
	chmod +x runServer.sh