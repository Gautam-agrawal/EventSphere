const {maxOtpCountLimit, maxOtpCountLimitTimeInSec} = require('../../../config/config');
const {getKey, setKey} = require('../../../utility/redis.utility');
const {sha256} = require('./helperFunctions');
const errors = require('../../../errors/errors')

module.exports = async function(channelId, email){
    const otpFloodingKey = sha256(`${channelId}_${email}`);
    const redisRes  = await getKey(otpFloodingKey);
    if (redisRes.error){
        return redisRes.error;
    }
    const otpFloodingArray = JSON.parse(redisRes.data);
    if (!otpFloodingArray || !otpFloodingArray.length){
        const newOtpFloodingArray = [Date.now()];
        await setKey(otpFloodingKey, JSON.stringify(newOtpFloodingArray), maxOtpCountLimitTimeInSec);
        return {error: false, message: "OTP generation limit not exceeded"}
    }
    
    if (otpFloodingArray.length < maxOtpCountLimit){
        otpFloodingArray.push(Date.now());
        await setKey(otpFloodingKey, JSON.stringify(otpFloodingArray), maxOtpCountLimitTimeInSec);
        return {error: false, message: "OTP generation limit not exceeded"}
    }

    const timeDifference = (Date.now() - otpFloodingArray.slice(-maxOtpCountLimit, -maxOtpCountLimit+1))/1000;
    if (timeDifference > maxOtpCountLimitTimeInSec){
        otpFloodingArray.push(Date.now());
        await setKey(otpFloodingKey, JSON.stringify(otpFloodingArray), maxOtpCountLimitTimeInSec);
        return {error: false, message: "OTP generation limit not exceeded"}
    }

    return {error: true, message: errors["008"].message, code: "008"};
}