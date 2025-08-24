const express = require('express');
const router = express.Router();

router.use('/v1', require('./routes/emailAlerts.controller'))

module.exports = router