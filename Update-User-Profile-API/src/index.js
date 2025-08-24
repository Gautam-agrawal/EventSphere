const express = require('express');
const router = express.Router();

router.use('/v1', require('./routes/updateUserProfile.controller'))

module.exports = router