const crypto = require("node:crypto");
const {staticOtp} = require('../../../config/config');
const { sha256 } = require('./helperFunctions');

module.exports = function(isWhitelisted, channel, channelConfigurations){
    const { OTP_LENGTH, EXPIRY_TIME_IN_SEC} = channelConfigurations;
    const otp = isWhitelisted ? parseInt(crypto.randomBytes(OTP_LENGTH).toString('hex'), 16).toString().padStart(OTP_LENGTH, '0').slice(0, OTP_LENGTH) : staticOtp;
    const createdTime = Date.now();
    const expiryTime = new Date(createdTime + EXPIRY_TIME_IN_SEC*1000).getTime();

    return {
        OTP_LENGTH,
        OTP: otp,
        HASHED_OTP: sha256(otp),
        CREATED_TIMESTAMP: createdTime,
        EXPIRY_TIMESTAMP: expiryTime,
        EXPIRY_TIME: EXPIRY_TIME_IN_SEC,
        CHANNEL_ID: channel,
        INVALID_ATTEMPTS: 0,
        TOTAL_INVALID_ATTEMPTS: channelConfigurations.INVALID_ATTEMPTS
    }
}