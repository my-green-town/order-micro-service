const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');

router.route('/test').get(controller.order.test);
                              
router.route('/place-order').post(controller.order.createNewOrder);
router.route('/assign-delivery-partner').post(controller.order.assignDeliveryPartner);

router.route('/assigned').get(controller.order.getAssignedOrder);

router.route('/services').get(controller.order.getOptedServices)

router.route('/orderDetails').get(controller.order.getOrderDetails)
                             .post(controller.order.addOrderDetails)
                             .put(controller.order.updateOrderDetails)
                             .delete(controller.order.deleteOrderDetails);

router.route('/shipment').get(controller.order.getShipment)
                         .post(controller.order.addShipment)
                         .put(controller.order.updateShipment)
                         .delete(controller.order.deleteShipment);

router.route('/').get(controller.order.fetchOrders)
                      .post(controller.order.createNewOrder);

router.route('/deliveryTag').put(controller.order.updateDeliveryTag);
                        






                              



module.exports = router;                     