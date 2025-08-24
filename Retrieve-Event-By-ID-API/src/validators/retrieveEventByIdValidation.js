const { param, validationResult } = require('express-validator');

const validateRetrieveEventById = [
  param('id').isMongoId().withMessage('Invalid event ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateRetrieveEventById;