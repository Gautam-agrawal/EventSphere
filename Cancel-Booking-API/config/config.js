const path = require('path');
const fs = require('fs')
const forge = require('node-forge');

let envFilePath = process.env.NODE_ENV;
console.log(envFilePath)
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
    dbConnectionString: process.env.DB_CONNECTION_STRING,
    dbSslCertPath: path.join(__dirname, process.env.SSL_CERT_PATH),
    encryptionAlgorithm: process.env.ENCRYPTION_ALGORITHM,
    encryptionKey: privateKey.decrypt(forge.util.decode64(process.env.ENCRYPTION_KEY)),
    encryptionIV: privateKey.decrypt(forge.util.decode64(process.env.ENCRYPTION_IV)),
    emailAlertsUrl: process.env.EMAIL_ALERTS_URL,
    emailAlertsTimeout: +process.env.EMAIL_ALERTS_TIMEOUT,
    bookingCancelEmailAlertsSubject: process.env.BOOKING_CANCEL_EMAIL_ALERTS_SUBJECT,
    bookingCancelEmailAlertsBody: process.env.BOOKING_CANCEL_EMAIL_ALERTS_BODY,
    bookingConfirmEmailAlertsSubject: process.env.BOOKING_CONFIRM_EMAIL_ALERTS_SUBJECT,
    bookingConfirmEmailAlertsBody: process.env.BOOKING_CONFIRM_EMAIL_ALERTS_BODY,
}