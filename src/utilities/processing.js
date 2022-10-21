const db = require("../../models");
const {Orders,OrderServices,OrderShipment} = db
const order = {

    create:async function(req,cart){
    
        let {userId} = req.userInfo;
        let order = {
            cartId: cart.data[0].service.cartId,
            status:'confirmed',
            userId: userId,
            merchantName:cart.cartInfo.merchantName,
            addressId:req.body.addressId
        };
        try{
            const orderCreatedRes = await Orders.create(order);
            return orderCreatedRes;
        }catch(error){
            console.error("Error is",error);
            let errObj =  new Error("Error in creating the order");
            errObj.status = 400;
            throw errObj;
        }
    },
    getLatest: async function(req){
        let {userId} = req.userInfo;
        return await Orders.findOne({
            where:{userId:userId},
            order:[["id","desc"]]
        })
    }
}
module.exports = {
    order,
    servicesSelected,
    orderShipmentHandlers
}