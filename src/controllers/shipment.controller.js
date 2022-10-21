const shipmentService = require('../services/shipment');
const orderService = require('../services/order')
const updateDeliveryTagsHandler = async (req, res,next)=>{
    try{    
        const updateTagRes = await shipmentService.updateDeliveryTags(req.token);
        res.json({msg:"Delivery tags updated",payloadRes:updateTagRes}) 
    }catch(err){
        next(err)
    }
} 
const check  = async (req, res, next)=>{
    try{
        res.json("check inside assigmet called");
    }catch(err){

    }
}

const setDeliveryParnterAvailable = async  (req,status)=>{
    const { userId } = req.userInfo;
    const { orderId} = req.body;

    const sendDeliveryAck = async ()=>{
        let order = await OrderShipment.findOne({where:{orderId:orderId}});
        axiosObj.setConfig({app:'msgQ',token:""});
        
        return await axiosObj.postRequest('/ack',{deliveryTag:order.deliveryTag});
    }

    const updateDeliveryCycle = async ()=>{
        if(status == 'deliveryToShopDone'){
            return OrderUpdateSerivice.updateDeliveryCycle({...req.userInfo, ...req.body});
        }
    }

    if(status == 'deliveryToShopDone') {
        await Promise.all([sendDeliveryAck(),updateDeliveryCycle()])
        axiosObj.setConfig({app:'main',token:req.token});
        let walletReq = {
            amount:30,
            userId:userId,
            action:'add',
            source:'swab Admin',
            description:`Comission Order Id ~ ${orderId}`,
            tokenCheck:false

        }
        let paymentDetails = await axiosObj.postRequest('/wallet/addToWallet',walletReq);
        let {id} = paymentDetails.data.transaction;
        console.log("tansc id",id);
        await OrderUpdateSerivice.updateDeliveryPaymentId({orderId,id});
        return await axiosObj.putRequest('/auth/user',{userId:userId});
    }else{
        return Promise.resolve({"msg":"Time has not come to ack"});
    }

}

const updateShipmentStatus = async(req, res) => {
    try {
        await shipmentService.shipment.updateStatus(req.body)
        return res.json({msg:"Shipment status updated"})
    } catch(err) {
        throw err
    }
}

const updateDeliveryPartner = async(req, res) => {
    try {
        await shipmentService.shipment.update(req.body)
        return res.json({msg:"Shipment Delivery Partner updated"})
    } catch(err) {
        throw err
    }
}




const updateShipment = async (req, res, next)=>{
    try{
        await shipmentService.shipment.update(req.body)
        return res.json({msg:"Shipment status updated"})
    }catch(err){
        next(err)
    } 
}

let assignDeliveryPartner = async(req, res, next) => {
    const {orderId, wishmasterId,deliveryTag} = req.body;
    try{
        let shipmentStatus = await  OrderShipment.findOne({where:{orderId:orderId}})
        if(shipmentStatus){
           await  OrderShipment.update({deliveryTag:deliveryTag, wishmasterId:req.wishmasterId, status:"pickupAssigned"},{where:{orderId:orderId}});
        }else{
            let tableRow = {
                orderId:orderId,
                wishmasterId:wishmasterId,
                cartId:0,
                status:"pickupAssigned",
                deliveryTag:deliveryTag
            }
            await OrderShipment.create(tableRow);
        }
        let resObj = {
            wishmasterId:wishmasterId
        }
        return res.status(200).json(resObj);
    }
    catch(error){
        console.log("error is",error);
        return next({err:{errMsg:"Not able to assign Order"},errorStack:error});
    }
   
    
    
}


const getShipment = async (req, res, next) => {
    const {orderId} = req.params;
    try{

        const shipmentRes = await shipmentService.shipment.getStatus(orderId)
        res.json(shipmentRes)
    }catch(err){
        throw new Error("Error in getting the shipment details")
    }
    
}


module.exports = {
    updateDeliveryTagsHandler,
    check,
    updateShipment,
    assignDeliveryPartner,
    getShipment,
    updateShipmentStatus,
    updateDeliveryPartner
}
