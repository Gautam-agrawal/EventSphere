const path = require('path');
const fs = require('fs')
const forge = require('node-forge');

let envFilePath = process.env.NODE_ENV;
if (!envFilePath){
    envFilePath = 'dev'
}
require('dotenv').config({path: path.resolve(__dirname, `.${envFilePath}.env`)});

const privateKeyPem = fs.readFileSync(path.join(__dirname, process.env.PRIVATE_KEY_FILE_PATH), 'utf8');
const privateKey = forge.pki.privateKeyFromPem(privateKeyPem); 

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.APP_PORT,
    logLevel: process.env.LOG_LEVEL,
    encryptionAlgorithm: process.env.ENCRYPTION_ALGORITHM,
    encryptionKey: privateKey.decrypt(forge.util.decode64(process.env.ENCRYPTION_KEY)),
    encryptionIV: privateKey.decrypt(forge.util.decode64(process.env.ENCRYPTION_IV)),
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
    templatesPath: path.join(__dirname, process.env.TEMPLATES_PATH),
    whitelistPath: path.join(__dirname, process.env.WHITELIST_PATH),
    maxOtpCountLimit: +process.env.MAX_OTP_COUNT_LIMIT,
    maxOtpCountLimitTimeInSec: +process.env.MAX_OTP_COUNT_LIMIT_TIME_IN_SEC,
    isStaticOtp: JSON.parse(process.env.IS_STATIC_OTP),
    staticOtp: process.env.STATIC_OTP,
    emailAlertsUrl: process.env.EMAIL_ALERTS_URL,
    emailAlertsTimeout: +process.env.EMAIL_ALERTS_TIMEOUT,
    redisOtpStorageTTL: +process.env.REDIS_OTP_STORAGE_TTL
}