const path = require('path');

let envFilePath = process.env.NODE_ENV;
if (!envFilePath){
    envFilePath = 'dev'
}
require('dotenv').config({path: path.resolve(__dirname, `.${envFilePath}.env`)});

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.APP_PORT,
    logLevel: process.env.LOG_LEVEL,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
    templatesPath: path.join(__dirname, process.env.TEMPLATES_PATH)
}