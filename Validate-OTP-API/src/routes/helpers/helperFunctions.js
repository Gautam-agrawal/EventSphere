const crypto = require("node:crypto");

module.exports.sha256 = function(string){
    return crypto.createHash('sha256').update(string).digest('base64');
}