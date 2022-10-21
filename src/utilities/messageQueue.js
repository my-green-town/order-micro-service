const orderUtil = require('./order');
const shipmentUtil = require('./shipment')
const axiosObj = require('../services/axios');
const checkup = async () => {
   try{
        axiosObj.setConfig({app:"msgQ",token:""})
        await axiosObj.getRequest("/status");
   }catch(err){
       throw new Error("Msg queue is down")
   }
}

const queue =  {
    push: async (placedOrder, token) =>{
        try{
            const payload = {"payload":{"orderId":placedOrder.id}}
            axiosObj.setConfig({app:"msgQ",token:token})
            return await axiosObj.postRequest("/push-order",payload);
        }catch(err){
            throw err
        }
    },
    ackDelivery:async ({deliveryTag, orderId, userId, status}) => {
        try{
            const payload = {"deliveryTag":deliveryTag,"orderId":orderId,"userId":userId};
            axiosObj.setConfig({app:"msgQ"});
            return await axiosObj.postRequest("/ack",payload);
        }catch(err){
            throw err;
        }
       
    }
}
module.exports={
    checkup,
    queue
}