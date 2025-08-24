const express = require('express');
const router = express.Router();
 
router.use('/v1', require('./routes/deleteEventByID.controller'))
 
module.exports = router