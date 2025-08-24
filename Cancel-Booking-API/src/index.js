const express = require('express');
const router = express.Router();
 
router.use('/v1', require('./routes/cancelBooking.controller'))
 
module.exports = router