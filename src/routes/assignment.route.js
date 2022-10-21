const express = require('express');
const router = express.Router();
const controller =  require('../controllers/assignment.controller');

router.post('/manual/assignment', controller.assignManual)
router.get('/check', controller.check)
router.post('/initialPushForShipment',controller.intialPushToOrderMsgQueue);
module.exports = router
