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
            return  OrderShipment.update({where:{orderId:orderId}},{status:status});
        } catch (err) {
            throw new Error("Shipment status update error")
        }
    },
    getsingleOrder : async ({orderId}) => {
        try {
            return  OrderShipment.findOne({where:{orderId:orderId}});
        } catch(err) {
            throw new Error("Error in getting order shipment details")
        }
    },
    updateDeliveryPartner: async ({orderId,partnerId})=>{
        try {
            return  OrderShipment.create({where:{orderId:orderId}},{wishmasterId:partnerId});
        } catch (err) {
            throw new Error("Error in updating the delivery partner.")
        }
    },
    create:async (row) => {
        try {
            await OrderShipment.create(row);
        } catch (err) {
            throw new Error("Error in shipment push")
        }

    } 
}
const user = { 
    update:  async ({id,status})=>{
        axiosService.setConfig({app:"main"})
        let response = await axiosService.postRequest('/user/wishmaster-status',{userId:id,isAvailable: status})
        return response;
    }
}


module.exports = {
    pickupQueue,
    shipment,
    user
}