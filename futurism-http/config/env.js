process.env.NODE_ENV = 'development';
process.env.PORT = '9001';

process.env.MONGO_URI = 'mongodb://admin:pass@localhost:27017/database';
process.env.REDIS_URI = 'redis://admin:pass@localhost:6379/';

process.env.GLOBE_URI = 'http://localhost:9002/';
process.env.GLOBE_KEY = 'secret';

process.env.S3_BUCKET = 'awesome-bucket';
process.env.S3_KEY = '';
process.env.S3_SECRET_KEY = '';

process.env.GAME_SERVERS = 'http://localhost:9100/';