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
    emailService: process.env.EMAIL_SERVICE_TYPE || undefined,
    emailHost: process.env.EMAIL_HOST || undefined,
    emailPort: process.env.EMAIL_PORT || undefined,
    emailUser: process.env.EMAIL_USER || undefined,
    emailPass: process.env.EMAIL_PASS ? privateKey.decrypt(forge.util.decode64(process.env.EMAIL_PASS)) : undefined,
    emailSecure: JSON.parse(process.env.EMAIL_SECURE)
}