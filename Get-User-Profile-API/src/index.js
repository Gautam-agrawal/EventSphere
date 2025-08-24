const express = require('express');
const router = express.Router();

router.use('/v1', require('./routes/getUserProfile.controller'))

module.exports = router