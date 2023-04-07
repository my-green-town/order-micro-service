
const db = require('../../models')
const orderUtilites = require('../utilities/order')
const shipmentUtils = require('../utilities/shipment')
const messageQueueUtils = require('../utilities/messageQueue');
const { order } = require('../controllers/index.controller');
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
        try {
            return db.OrderShipment.findOne({ attributes:['status','wishmasterId','deliveryTag','orderId'] ,where :{orderId:orderId}})
        }catch(err){
            throw new Error("Not able to fetch order status");
        }
    },
    updateStatus:async ({status,orderId}) => {
        const {wishmasterId} = await db.OrderShipment.findOne({where:{orderId:orderId},order:[['createdAt','DESC']]})
        let row = {orderId:orderId, status:"",wishmasterId:wishmasterId};
        try {

            switch(status) {
                case 0: {
                    row.status = 'PICKUP_ASSIGNED';
                    break;
                }
                case 'PICKUP_ARRIVED':{
                    row.status = 'PICKUP_ARRIVED';
                    break;
                }
                case 'PICKUP_COLLECTED': {
                    row.status = 'PICKUP_COLLECTED';
                    break;
                }
                case 'PICKUP_COMPLETE':{
                    row.status = 'PICKUP_COMPLETE';
                    break;
                }
                case 'DROP_ASSIGNED': {
                    row.status = 'DROP_ASSIGNED';
                    break;
                }
                case 'DROP_ARRIVED':{
                    row.status = 'DROP_ARRIVED';
                    break;
                }
                case 'DROP_COLLECTED': {
                    row.status = 'DROP_COLLECTED';
                    break;
                }
                case 'DROP_COMPLETE':{
                    row.status = 'DROP_COMPLETE';
                    break;
                }
                default:{
                    row.status = 'UNKNOWN_STATUS';
                }
            }
            return await db.OrderShipment.create(row);    
           
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

updateWishMaster = async (input)=>{

    try{
        return await shipmentUtils.user.update(input)
    }catch(err){
        console.log("error in updating the user",err);
    }
   
}

module.exports = {  
    updateDeliveryTags,
    pushToPickupQueue,
    shipment,
    updateWishMaster
}