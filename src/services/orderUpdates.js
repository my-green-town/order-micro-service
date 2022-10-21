
const db = require("../../models");
const {Sequelize} = db.Sequelize;
const { Op } = Sequelize;
const {DeliveredOrders,OrderShipment} = db;
const updateDeliveryCycle = async (req)=>{
    const {orderId, userId} = req;
    const { firstName } = req;

    const OrderShipmentsDetails = await OrderShipment.findOne({where:{orderId:orderId}});
    const {id} = OrderShipmentsDetails;
    let row = {
        orderId: orderId,
        shipmentId: id,
        wishmasterId: userId,
        wishmasterName: firstName,
        status: "deliveryToShopDone"

    }
    try{
        return await  DeliveredOrders.create(row);
    }catch(err){
        console.log("Error in added devlivered order");
        return Promise.reject({msg:"Error in adding the delivered order"});
    } 
}

const updateDeliveryPaymentId = async ({ orderId, id }) => {
    try{
        return await  DeliveredOrders.update({paymentId:id},{where:{orderId:orderId}});
    }catch(err){
        console.log("Error in updating payment details");
        return Promise.reject({msg:"Error in adding the delivered order"});
    } 
}


module.exports = {
    updateDeliveryCycle,
    updateDeliveryPaymentId
}