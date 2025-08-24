const crypto = require("node:crypto");
const {encryptionAlgorithm, encryptionKey, encryptionIV} = require("../../../config/config")

module.exports = function(encryptedString){
    const decipher = crypto.createDecipheriv(encryptionAlgorithm, encryptionKey, encryptionIV);
    const decryptedMsg = decipher.update(encryptedString, "base64", "utf8") + decipher.final('utf8');
    return decryptedMsg;
}