const express = require('express');
const router = express.Router();
 
router.use('/v1', require('./routes/retrieveEventById.controller'))
 
module.exports = router