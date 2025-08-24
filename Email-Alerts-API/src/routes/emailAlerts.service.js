const {infoLogger, errorLogger} = require('../../logger/logger');
const errors = require('../../errors/errors');
const decryptor = require('./helpers/decrypt');
const mailingAgent = require('./helpers/mailingAgent');

async function emailAlerts(req, res, next){
    try{
        infoLogger(req.custom.id, req.body.requestId, "Decrypting email subject and body");
        const plainBody = decryptor(req.body.body);
        const plainSubject = decryptor(req.body.subject);
        infoLogger(req.custom.id, req.body.requestId, "Sending email");
        const resMail = await mailingAgent({
            email: req.body.email,
            subject: plainSubject,
            body: plainBody
        })

        if (resMail.error){
            infoLogger(req.custom.id, req.body.requestId, resMail.message);
            return res.status(200).json({
                statusCode: 1,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                info: {
                    code: errors[resMail.error.code].code,
                    message: resMail.error.message || errors[resMail.error.code].message,
                    displayText: errors[resMail.error.code].displayText
                },
                error: err
            })
        }

        infoLogger(req.custom.id, req.body.requestId, resMail.message);
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


module.exports = emailAlerts


