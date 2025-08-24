const {infoLogger, errorLogger} = require('../../logger/logger');
const errors = require('../../errors/errors');
const {templatesPath, whitelistPath, isStaticOtp, redisOtpStorageTTL} = require('../../config/config')
const templates = require(templatesPath);
const whitelistings = require(whitelistPath);
const otpFlooding = require('./helpers/otpFloodingCheck');
const generateOtpFunction = require('./helpers/generateOtp');
const deliverOtp = require('./helpers/deliverOtp');
const { getKey, setKey } = require('../../utility/redis.utility');

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

        // First check if OTP duplicate.
        const otpObjectFromRedis = await getKey(`${channel}_${req.body.otpRequestId}`);
        if(otpObjectFromRedis.data){
            infoLogger(req.custom.id, req.body.requestId, `Duplicate OTP Request ID`)
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

        // Check OTP flooding
        const floodingResponse = await otpFlooding(req.body.channelId, req.body.email);
        if (floodingResponse.error){
            infoLogger(req.custom.id, req.body.requestId, `OTP generation limit exceeded`)
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

        const whitelist =  whitelistings.email.includes(req.body.email);
        const isDynamic = isStaticOtp ? whitelist : true;
        const otpObject = generateOtpFunction(isDynamic, channel, templates[channel]);
        infoLogger(req.custom.id, req.body.requestId, 'Setting OTP Data');
        const otpObjectCopy = {...otpObject}
        delete otpObject.OTP;
        await setKey(`${req.body.channelId}_${req.body.otpRequestId}`, JSON.stringify(otpObject), redisOtpStorageTTL)
        if (isDynamic){
            infoLogger(req.custom.id, req.body.requestId, 'Dynamic OTP will be generated')
            const deliveryRes = deliverOtp(otpObjectCopy, req.body, templates[channel]);
            if (deliveryRes.error){
                return res.status(200).json({
                    statusCode: 1,
                    timestamp: Date.now(),
                    requestId: req.body.requestId,
                    info: {
                        code: deliveryRes.code,
                        message: errors[deliveryRes.code].message,
                        displayText: errors[deliveryRes.code].displayText
                    }
                })
            }
        }

        return res.status(200).json({
            statusCode: 0,
            timestamp: Date.now(),
            requestId: req.body.requestId,
            data: {
                otpRequestId: req.body.otpRequestId
            },
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


