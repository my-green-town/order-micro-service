
const db = require("../../models");
const { order } = require("../controllers/index.controller");
const {Sequelize} = db.Sequelize;
const { Op } = Sequelize;
const {DeliveredOrders,OrderServiceDetails,Orders,OrderParticulars,OrderServices} = db;
const cartUtil = require('../utilities/cart');
const orderUtil = require('../utilities/order');
const msgUtil = require('../utilities/messageQueue')
const eventEmitter = require('../../src/event-emitters/');
const getDeliveredOrder = async (req)=>{
    const {userId} = req; 
    try{
        let delivered = await DeliveredOrders.findAll({
            where:{wishmasterId:userId},
            include:db.Orders
        });
        
        return delivered;
    }catch(err){
        console.log("Error in getting delivered order",err);
        return Promise.reject({msg:"Error in getting the delivered order"});
    } 
}

const orderParticulars = async (req)=>{
    const {serviceId} = req;
    let fetchParticulars = async ()=>{
            return  OrderServices.findOne({
                attributes:['id','name','unit'],
                where:{id:serviceId},
                include:{
                    model: OrderParticulars,as :"particulars",
                    attributes:["id","count"],
                    include:{
                        model:OrderServiceDetails,as:"serviceDetail",
                        attributes:['id',"cloth"]
                    }
                },
                order:[[{model:OrderParticulars,as:"particulars"},'id', 'DESC']]
            })
    }
    try{
        return fetchParticulars();
    }catch(err){
        console.log("error is",err);
        next(err);
    }
}

const singleParticlarRow = async (req)=>{
    const {serviceId,particularId} = req;
    let fetchParticular = async ()=>{
            return  OrderServices.findOne({
                attributes:['id','name'],
                where:{id:serviceId},
                include:{
                    where:{id:particularId},
                    model: OrderParticulars,
                    as:"particulars",
                    include:{model:OrderServiceDetails,as:"serviceDetail",attributes:['cloth','price']}
                }
            })
    }
    try{
        return fetchParticular();
    }catch(err){
        console.log("error is",err);
        next(err);
    }
}

const getOrderSummary = async (req)=>{
    const {orderId} = req; 
    let fetchServices = async()=>{

        let orderSummary = await Orders.findOne({
            where:{
                id:orderId,
            },
            include:{
                model:OrderServices,
                include:[{model:OrderServiceDetails, as:"serviceDetail"}]
            }
        });
        return orderSummary
    }

    try{
       let summary = await fetchServices();
       return summary;
    }catch(err){
        console.log("Err is",err);
    }
}

const fetchOrderSummary = async(req)=>{
    try{
        const latestOrder = await orderUtil.order.getLatest(req);

        const services = await orderUtil.servicesSelected.findAll({orderId:latestOrder.dataValues.id})
        return {
            payload:{
                orderId:latestOrder.dataValues.id,
                services:services
            }
        }
    }catch(err){
        throw err
    }
}

const placeOrder = async (req) => {
    try{
        const filledUserCart = await cartUtil.userCart.get(req.token);
        const createdOrder = await orderUtil.order.create(req,filledUserCart.data);
        await cartUtil.createACopyOfCart(req.token, filledUserCart.data.data, createdOrder);
        await orderUtil.orderShipmentHandlers.push(createdOrder);
        await cartUtil.userCart.clear(req.token, filledUserCart.data.data[0].service.cartId);
        return createdOrder;
    }catch(error){
        console.log("error is",error);
        throw error;
    }
}

updateOrderStatus = async (req) => {
    try {
        return  await Orders.update({where:{id:req.orderId}},{status:req.status})
    } catch(err) {
        throw new Error("Error in updating the order status")
    }
}






module.exports = {
    getDeliveredOrder,
    orderParticulars,
    singleParticlarRow,
    getOrderSummary,
    placeOrder,
    fetchOrderSummary
}