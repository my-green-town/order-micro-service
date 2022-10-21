const express = require('express');
const router = express.Router();
const controller =  require('../controllers/processing.controller');

router.post('/save-count', controller.saveCount)
module.exports = router
