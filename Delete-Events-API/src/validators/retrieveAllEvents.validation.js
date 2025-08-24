const Joi = require('joi');
const errors = require('../../errors/errors');
const { infoLogger } = require('../../logger/logger');

module.exports = function (req, res, next) {
  const schema = Joi.object({
    pageNumber: Joi.number().integer().min(1),
    pageSize: Joi.number().integer().min(1).max(100),
  });

  const { error } = schema.validate(req.query, { abortEarly: true });

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
