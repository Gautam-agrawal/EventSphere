const Joi = require('joi');
const errors = require('../../errors/errors')
const {infoLogger} = require('../../logger/logger')


module.exports = function(req, res, next) {
    const schema = Joi.object({
        requestId: Joi.string().required(),
        email: Joi.string().email().required(),
        subject: Joi.string().required(),
        body: Joi.string().required()
    });


    const {value, error} = schema.validate(req.body, {abortEarly: true})
    if (error){
        const key = error.details[0].context.key
        infoLogger(req.custom.id, req.body.requestId, `Error in validation: ${key} is invalid`)
        const message = error.details[0].message
        return res.status(400).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: req.body.requestId || req.custom.id,
            info: {
                code: errors['004'].code,
                message: message || error.errors['004'].message,
                displayText: errors['004'].displayText
            },
        })
    }

    infoLogger(req.custom.id, req.body.requestId, `All validations passed`)
    return next()
}
