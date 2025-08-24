const crypto = require("node:crypto");
const {encryptionAlgorithm, encryptionKey, encryptionIV} = require("../../config/config");

module.exports.encrypt = function(plainString){
    const cipher = crypto.createCipheriv(encryptionAlgorithm, encryptionKey, encryptionIV);
    const encryptedMsg = cipher.update(plainString, "utf8", "base64") + cipher.final('base64');
    return encryptedMsg;
}

module.exports.sha256 = function(string){
    return crypto.createHash('sha256').update(string).digest('base64');
}


module.exports.getDateString = (dateTimeString) => {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(dateTimeString));
}

module.exports.getEstTimeString = (dateTimeString) => {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    }).format(new Date(dateTimeString));
}