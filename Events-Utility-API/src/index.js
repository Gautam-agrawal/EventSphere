const express = require('express');
const router = express.Router();
 
router.use('/v1', require('./routes/utilityEvents.controller'))
 
module.exports = router