const express = require('express');
const router = express.Router();

router.use('/v1', require('./routes/generateOtp.controller'))

module.exports = router