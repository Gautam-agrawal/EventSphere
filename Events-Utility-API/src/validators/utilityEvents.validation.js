const Joi = require('joi');
const errors = require('../../errors/errors');
const { infoLogger } = require('../../logger/logger');

module.exports = function (req, res, next) {
  const schema = Joi.object({
    requestId: Joi.string().required(),
    userId: Joi.string().required(),
    type: Joi.string().valid("bookmarks", "bookings", "orders").required()
  });

  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    const key = error.details[0].context.key;
    infoLogger(req.custom.id, req.query.requestId, `Error in validation: ${key} is invalid`);
    const message = error.details[0].message;
    return res.status(400).json({
      statusCode: 1,
      timestamp: Date.now(),
      requestId: req.query.requestId || req.custom.id,
      info: {
        code: errors['004'].code,
        message: message || errors['004'].message,
        displayText: errors['004'].displayText,
      },
    });
  }

  infoLogger(req.custom.id, req.query.requestId, `All validations passed`);
  next();
};
