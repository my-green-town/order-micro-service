const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');

router.route('/test').get(controller.order.test);
                              
router.route('/place-order').post(controller.order.createNewOrder);
router.route('/assign-delivery-partner').post(controller.order.assignDeliveryPartner);

router.route('/assigned').get(controller.order.getAssignedOrder)
router.route('/delivered').get(controller.order.deliveredOrder);

router.route('/services/:orderId').get(controller.order.getOptedServices)

router.route('/service/details/:id').get(controller.order.getServiceAndParticulars)

router.route('/orderDetails').get(controller.order.getOrderDetails)
                             .post(controller.order.addOrderDetails)
                             .put(controller.order.updateOrderDetails)
                             .delete(controller.order.deleteOrderParticular);
                             
router.route('/particular').get(controller.order.addOrderParticular)
                           .post(controller.order.addOrderParticular)
                           .put(controller.order.updateOrderDetails)
                           .delete(controller.order.deleteOrderParticular);

router.route('/particular/order/:orderId').get(controller.order.getParticularsInOrder);

            

router.route('/service/particular/:serviceId').get(controller.order.getServiceParticulars);

router.route('/service/quantity').post(controller.order.insertOrderQuantity)

router.route('/shipment/:orderId').get(controller.order.getShipment)
                         .post(controller.order.addShipment)
                         .put(controller.order.updateShipment)
                         .delete(controller.order.deleteShipment);

router.route('/summary/:orderId').get(controller.order.getOrderSummary)
                         .post(controller.order.addShipment)
                         .put(controller.order.updateShipment)
                         .delete(controller.order.deleteShipment);


router.route('/').get(controller.order.fetchOrders)
                 .post(controller.order.createNewOrder);


router.route('/deliveryTag').put(controller.order.updateDeliveryTag);
                        
module.exports = router;                     