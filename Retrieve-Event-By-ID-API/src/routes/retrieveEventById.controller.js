const express = require('express');
const router = express.Router();
const { v4 } = require('uuid');
const errors = require('../../errors/errors');
const retrieveEventService = require('./retrieveEventById.service');


// Endpoint for retrieving an event by ID
router.get('/event/:id', retrieveEventService);

// Catch-all endpoint for handling unsupported HTTP methods
router.all('*', (req, res, next) => {
  return res.status(405).json({
    statusCode: 1,
    timestamp: Date.now(),
    requestId: req.body.requestId || v4(),
    info: {
      code: errors['005'].code,
      message: errors['005'].message,
      displayText: errors['005'].displayText,
    },
  });
});

module.exports = router;
