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
    dbConnectionString: process.env.DB_CONNECTION_STRING,
    dbSslCertPath: path.join(__dirname, process.env.SSL_CERT_PATH)
}