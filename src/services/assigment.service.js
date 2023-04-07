const db = require('../../models')
const userUtil = require('../utilities/user');
const shipmentUtil  = require('../utilities/shipment');
const orderUtil = require('../utilities/order')
const { OrderShipment } = db 
const manual = {
    assign: async ({orderId, wishmasterId}) => {

        const updates = {
            orderId:orderId,
            wishmasterId:wishmasterId,
            status:"pickupAssigned"
        }
        const whereCondition  = {
            where:{
                orderId:orderId
            }
        }
        try{
            return  await OrderShipment.update(updates,whereCondition) 
        }catch(err){
            throw err
        }
        
    }
}

const autoAssign = {
    assign: async ({orderId}) => {
        try{
            const result = await userUtil.delivery.getAvailablePartner();
            if(result.status === 'PARTNER_BUSY') {
                return {'msg':"All delivery Partner are busy, Trying to find delivery partner soon."}
            }
            /**
             * partner found ,assign him the order
             *
            */
           const {data} = result;
           console.log("result",result)
            const row = {
                orderId:orderId,
                status:'PICKUP_ASSIGNED',
                wishmasterId:data.id
            }
            /*
            *update shipment table
            */
            await shipmentUtil.shipment.create(row)
            /**
             * update order table
             */
            await orderUtil.order.updateStatus({orderId:orderId,status:'PICKUP'})
            
            return {"msg":`Shipment assigned for pickup to parnter ${data.firstName}`}

        //    await shipmentUtil.shipment.updateDeliveryPartner({orderId:orderId,partnerId:result.id});
        //    await shipmentUtil.shipment.updateStatus({orderId:orderId,status:'PICK_UP_PARTNER_ASSIGNED'});
        
        }catch(err){
            console.log("Error in autoAssign",err);
            throw err
        }
        
    }
}

module.exports={
    manual,
    autoAssign
}