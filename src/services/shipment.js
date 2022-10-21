
const db = require('../../models')
const orderUtilites = require('../utilities/order')
const shipmentUtils = require('../utilities/shipment')
const messageQueueUtils = require('../utilities/messageQueue');
const { OrderServiceDetails } = db 

const UPDATE_STATUS  = {
    "PICK_UP_PARTNER_ASSIGNED":"PICK_UP_PARTNER_ASSIGNED",
    "PICK-UP_COMPLETE":'PICKED_UP',
    "DROP_AT_SHOP_COMPLETE'":'UNDER_WASH',
    "DELIVERY_PARTNER_ASSIGNED":"DELIVERY_PARTNER_ASSIGNED",
    "DELIVERY_TO_CUST_START":"OUT_FOR_DELIVERY",
    "DELIVERY_TO_CUST_COMPLETE":"DELIVERED"



}

const updateDeliveryTags = async (token) => {
    try{
        const ordersAlreadyPicked = await orderUtilites.orderShipmentHandlers.getOrderHavingDeliveryPatnerAssigned();
        await shipmentUtils.pickupQueue.pushMultipleOrders(token,ordersAlreadyPicked)
        return ordersAlreadyPicked
    }catch(err){
        console.log("err is",err);
    } 
}

const pushToPickupQueue = ()=>{

}

const shipment = {
    getStatus : async (orderId) => {
        try{
            return db.OrderShipment.findOne({ attributes:['status','wishmasterId','deliveryTag','orderId'] ,where :{orderId:orderId}})
        }catch(err){
            throw new Error("Not able to fetch order status");
        }
    },
    updateStatus:async ({status,orderId}) => {
        let whereQuery = {where:{orderId:orderId}};
        let updateQuery = {status:status}

        try {

            if(status == 'DROP_AT_SHOP_COMPLETE') {
                //ack the message queue
                const updatedOrderShipment = await shipmentUtils.shipment.getsingleOrder({orderId:orderId});
                console.log("shipment details",updatedOrderShipment.status);
                await messageQueueUtils.queue.ackDelivery({
                    status:status,
                    orderId:orderId,
                    userId:updatedOrderShipment.wishmasterId,
                    deliveryTag:updatedOrderShipment.deliveryTag
                })
            }

            const shipmentUpdateRes = await db.OrderShipment.update(updateQuery,whereQuery);
            const req = {
                status:status,
                orderId:orderId
            }
            await orderUtilites.order.updateStatus(req);

            
            return shipmentUpdateRes;
        }catch(err){
            console.log("error is",err);
            throw err;
        }
    },
    update:async (updateValues) =>{
        const {orderId,status,deliveryTag,wishmasterId} = updateValues;
        let updateQuery = {
            status:status,
            deliveryTag:deliveryTag,
            wishmasterId:wishmasterId
        }
        let whereQuery ={where:{orderId:orderId}};
    
        try{

            return await db.OrderShipment.update(updateQuery,whereQuery);
        
        }catch(err){
            console.log("error is",err);
            throw err
        }
    }
}

module.exports = {  
    updateDeliveryTags,
    pushToPickupQueue,
    shipment
}