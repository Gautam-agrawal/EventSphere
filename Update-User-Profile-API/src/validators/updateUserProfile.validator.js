const Joi = require('joi');
const errors = require('../../errors/errors')
const {infoLogger} = require('../../logger/logger')


module.exports = function(req, res, next) {
    const schema = Joi.object({
        requestId: Joi.string().required(),
        userId: Joi.string().required(),
        about: Joi.string(),
        userPic: Joi.string(),
        country: Joi.string(),
        streetAddress: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zip: Joi.string()
    });

    const parsedBody = JSON.parse(req.body)
    const {value, error} = schema.validate(parsedBody, {abortEarly: true})
    if (error){
        const key = error.details[0].context.key
        infoLogger(req.custom.id, parsedBody.requestId, `Error in validation: ${key} is invalid`)
        const message = error.details[0].message
        return res.status(400).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: parsedBody.requestId || req.custom.id,
            info: {
                code: errors['004'].code,
                message: message || error.errors['004'].message,
                displayText: errors['004'].displayText
            },
        })
    }

    infoLogger(req.custom.id, parsedBody.requestId, `All validations passed`)
    return next()
}
