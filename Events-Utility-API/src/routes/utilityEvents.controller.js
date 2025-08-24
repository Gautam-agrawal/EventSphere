const express = require('express');
const { v4 } = require('uuid');

const router = express.Router();
const errors = require('../../errors/errors');
const Event = require('../models/events');

// New route to retrieve all events
router.post('/utilityEvents', require('../validators/utilityEvents.validation'), require('./utilityEvents.service'));

module.exports = router;
