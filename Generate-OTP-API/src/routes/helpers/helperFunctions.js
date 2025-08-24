const crypto = require("node:crypto");
const {encryptionAlgorithm, encryptionKey, encryptionIV} = require("../../../config/config");

module.exports.encrypt = function(plainString){
    const cipher = crypto.createCipheriv(encryptionAlgorithm, encryptionKey, encryptionIV);
    const encryptedMsg = cipher.update(plainString, "utf8", "base64") + cipher.final('base64');
    return encryptedMsg;
}

module.exports.sha256 = function(string){
    return crypto.createHash('sha256').update(string).digest('base64');
}