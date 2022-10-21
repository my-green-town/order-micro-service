const db = require("../../models");
const axiosService = require('../services/axios');
const {Orders,OrderServices,OrderShipment} = db
const pickupQueue = {

    pushMultipleOrders:async function(token,placedOrders) {

        let pushToQueuePromises = [];
        placedOrders.forEach(order=>{
            axiosService.setConfig({token:token,app:"msgQ"})
            let requestToMsgQ = axiosService.postRequest('/push-order',{payload:{"orderId":order.orderId}})
            pushToQueuePromises.push(requestToMsgQ)  
        })

        await Promise.all(pushToQueuePromises)
    },
}

const shipment = {
    updateStatus :async  ({orderId,status})=>{
        try {
            return await OrderShipment.update({where:{orderId:orderId}},{status:status});
        } catch (err) {
            throw new Error("Shipment status update error")
        }
    },
    getsingleOrder : async ({orderId}) => {
        try {
            return await OrderShipment.findOne({where:{orderId:orderId}});
        } catch(err) {
            throw new Error("Error in getting order shipment details",err)
        }
    } 
}


module.exports = {
    pickupQueue,
    shipment
}