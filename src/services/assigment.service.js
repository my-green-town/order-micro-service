const db = require('../../models')
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

module.exports={
    manual
}