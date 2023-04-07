const express = require('express');
const router = express.Router();
const controller =  require('../controllers/assignment.controller');

router.post('/manual/assignment', controller.assignManual)
router.post('/auto',controller.autoAssign)
router.get('/check', controller.check)
router.post('/initialPushForShipment',controller.intialPushToOrderMsgQueue);
module.exports = router
