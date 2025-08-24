const express = require('express');
const router = express.Router();
const { v4 } = require('uuid');
const errors = require('../../errors/errors');
const deleteEventService = require('./deleteEventByID.service');

// Endpoint for deleting an event by ID
router.delete('/event/:id', deleteEventService);

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
