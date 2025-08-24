const {infoLogger, errorLogger} = require('../../logger/logger');
const errors = require('../../errors/errors');
const {templatesPath, whitelistPath, isStaticOtp} = require('../../config/config')
const templates = require(templatesPath);
const { getKey, setKey, getTTL, deleteKey } = require('../../utility/redis.utility');
const { sha256 } = require('./helpers/helperFunctions');

async function generateOtp(req, res, next){
    try{
        // Check if channel id is present in the templates file.
        req.body.id = req.custom.id;
        const channel = req.body.channelId;
        if(!templates[channel]){
            infoLogger(req.custom.id, req.body.requestId, `Invalid channel id passed`)
            return res.status(200).json({
                statusCode: 1,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                info: {
                    code: errors['007'].code,
                    message: errors['007'].message,
                    displayText: errors['007'].displayText
                }
            })
        }

        const otpObjectFromRedis = await getKey(`${channel}_${req.body.otpRequestId}`);
        if(!otpObjectFromRedis.data){
            infoLogger(req.custom.id, req.body.requestId, `Invalid Request ID`)
            return res.status(200).json({
                statusCode: 1,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                info: {
                    code: errors['009'].code,
                    message: errors['009'].message,
                    displayText: errors['009'].displayText
                }
            })
        }

        const jsonData = JSON.parse(otpObjectFromRedis.data);
        if (req.body.channelId != jsonData.CHANNEL_ID){
            infoLogger(req.custom.id, req.body.requestId, `Invalid channel id passed`)
            return res.status(200).json({
                statusCode: 1,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                info: {
                    code: errors['007'].code,
                    message: errors['007'].message,
                    displayText: errors['007'].displayText
                }
            })
        }   

        const now = Date.now();
        if (!(now >= jsonData.CREATED_TIMESTAMP && now <= jsonData.EXPIRY_TIMESTAMP)){
            infoLogger(req.custom.id, req.body.requestId, `OTP Time Expired`)
            return res.status(200).json({
                statusCode: 1,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                info: {
                    code: errors['010'].code,
                    message: errors['010'].message,
                    displayText: errors['010'].displayText
                }
            })
        }

        if(jsonData.INVALID_ATTEMPTS >= jsonData.TOTAL_INVALID_ATTEMPTS){
            infoLogger(req.custom.id, req.body.requestId, `OTP Invalid Attempts Exceeded`);
            return res.status(200).json({
                statusCode: 1,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                info: {
                    code: errors['011'].code,
                    message: errors['011'].message,
                    displayText: errors['011'].displayText
                }
            })
        }

        if (req.body.otp != jsonData.HASHED_OTP){
            infoLogger(req.custom.id, req.body.requestId, `OTP passed is invalid`)
            jsonData.INVALID_ATTEMPTS += 1;
            const newTTL = await getTTL(`${req.body.channelId}_${req.body.otpRequestId}`);
            await setKey(`${req.body.channelId}_${req.body.otpRequestId}`, JSON.stringify(jsonData), newTTL.data);
            return res.status(200).json({
                statusCode: 1,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                info: {
                    code: errors['008'].code,
                    message: errors['008'].message,
                    displayText: errors['008'].displayText
                }
            })
        }

        infoLogger(req.custom.id, req.body.requestId, `OTP is valid`)
        deleteKey(`${req.body.channelId}_${req.body.otpRequestId}`)
        return res.status(200).json({
            statusCode: 0,
            timestamp: Date.now(),
            requestId: req.body.requestId,
            info: {
                code: errors['000'].code,
                message: errors['000'].message,
                displayText: errors['000'].displayText
            }
        })
    }
    catch(err){
        errorLogger(req.custom.id, req.body.requestId, `Unexpected error | ${err.message}`, err)
        return res.status(500).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: req.body.requestId,
            info: {
                code: errors['006'].code,
                message: err.message || errors['006'].message,
                displayText: errors['006'].displayText
            },
            error: err
        })
    }
}


module.exports = generateOtp


