const axiosObj = require('../services/axios');
const checkup = async () => {
   try{
        axiosObj.setConfig({app:"msgQ",token:""})
        await axiosObj.getRequest("/status");
   }catch(err){
       throw new Error("Msg queue is down")
   }
}

const pickupQueue =  {
    push: async (placedOrder, token) =>{
        const payload = {"payload":{"orderId":placedOrder.id}}
        axiosObj.setConfig({app:"msgQ",token:token})
        await axiosObj.postRequest("/push-order",payload);
    }
}
module.exports={
    checkup,
    pickupQueue
}