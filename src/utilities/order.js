const db = require("../../models");
const queueUtil = require('./messageQueue')
const {Orders,OrderServices,OrderShipment} = db
const {Op} = db.Sequelize
const order = {

    create:async function(req,cart){
    
        let {userId} = req.userInfo;
        let order = {
            cartId: cart.data[0].service.cartId,
            status:'PLACED',
            userId: userId,
            merchantName:cart.cartInfo.merchantName,
            addressId:req.body.addressId
        };
        try{
            return await Orders.create(order);
        }catch(error){
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
    },
    updateStatus: async function(req){
        let {orderId, status} = req;
        const whereQ = {id:orderId}
        const updateQ = {status:status}
        return await Orders.update(updateQ,{where:whereQ})
    }
    
}

const orderShipmentHandlers = {
    push: async function (order){
        try{
            const tableRow = {orderId:order.id}
            return await OrderShipment.create(tableRow)
        }catch(err){
            throw new Error("Not able to push order to shipment");
        }
    },
    getOrderHavingDeliveryPatnerAssigned:async function(){
        return await OrderShipment.findAll({
            attributes:["wishmasterId","orderId"],
            where:{wishmasterId:{[Op.ne]: null}},
        })
    }
}

const servicesSelected = {
    findAll:async function({orderId}){
        return await OrderServices.findAll({attributes:['name'],where:{orderId:orderId}})
    }
}

const orderPickupQueue = {
    push:async (placedOrder) => {
        try{
            queueUtil.queue.push()
        }catch(err){
            console.log("error is",err);
        }
    }
}

module.exports = {
    order,
    servicesSelected,
    orderShipmentHandlers,
    orderPickupQueue
}