const express = require('express');
const { put } = require('request');
const router = express.Router();
const controller =  require('../controllers/shipment.controller');
console.log("came inside router")
router.post('/initial', controller.updateDeliveryTagsHandler)
router.put('/status', controller.updateShipmentStatus)
router.put('/delivery-partner', controller.updateDeliveryPartner)

router.route('/:orderId').get(controller.getShipment)
                         .put(controller.updateShipment)




// router.route('/:orderId').get(controller.order.getShipment)
//                          .post(controller.order.addShipment)
//                          .put(controller.order.updateShipment)
//                          .delete(controller.order.deleteShipment);
router.get('/check', controller.check)
module.exports = router
