const express = require('express');
const router = express.Router();

router.use('/v1', require('./routes/signup.controller'))

module.exports = router