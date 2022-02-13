/**
 * Apis related to order
 * /order/get
 * /order/put
 * /order/post
 * /order/delete
 */

 const { request, response } = require('express');
 const mongoose = require('mongoose');
 const db = require("../../../../models");
 const {Sequelize} = db.Sequelize;
 const { Op } = Sequelize;
 const {Orders, OrderDetails, OrderServices, OrderShipment} = db;

 const axiosObj = require('../services/axios');
const { Query } = require('mongoose');

let test =(req, res)=>{
    res.send("test called in Cart, thanks for calling");
}

let createNewOrder = async (req, res, next)=>{
    let getCart = async ()=>{
        axiosObj.setConfig({app:'cart',token:req.token});
        try{
            return await axiosObj.getRequest('/cart/getDetails');
        }catch(err){
            throw new Error(err);
        }           
    }
    let createOrder = async (cart)=>{
        let {userId} = req.userInfo;
        let order = {
            cartId: cart.data[0].service.cartId,
            status:'confirmed',
            userId: userId,
            merchantName:cart.cartInfo.merchantName
        };
        try{
            return await Orders.create(order);


        }catch(error){
            
        }
    }

    let addServicesToOrder = async (cart,order)=>{
        console.log("order",cart);
        for(let i=0;i<cart.length;i++){
            let eachService = cart[i];

            let service = {
                orderId:order.id,
                cartId: cart[0].service.cartId,
                serviceId:eachService.service.serviceId,
                serviceName:eachService.detail.name,
                servicePrice:eachService.detail.price,
                serviceTat:eachService.detail.tat,
                serviceUnit:eachService.detail.unit
            }
            console.log("service",service);
            try{
                await OrderServices.create(service);
            }catch(err){
                throw new Error(err);
            }
            
        }
    }

    let addOrderToQueue = async(order)=>{
        //pass the messga to order queue
        let orderId = order.id;
        axiosObj.setConfig({app:'msgQ',token:""});
        axiosObj.postRequest('/push-order',{payload:{orderId:orderId}});
    }

    let cleanCart = async (cartDetails)=>{
        const {id} = cartDetails.cartInfo;
        axiosObj.setConfig({app:'cart',token:""});
        let req = {
            cartId:id,
            tokenCheck:false
        }
        console.log("clean cart is", req);
        try{
            return await axiosObj.deleteRequest('/cart/delete',req);
        }catch(err){
            throw new Error(err);
        }   
        
    }

    try{
        let cart =  await getCart();
        let order = await createOrder(cart.data);
        order  = {...order.dataValues,...{orderId:order.id}};
        let services = await addServicesToOrder(cart.data.data, order);
        let addToQueueRes = await addOrderToQueue(order);
        await cleanCart(cart.data);
        res.json(order);
    }catch(err){
        console.log("Error is",err);
        next(err);
    }


}

let assignDeliveryPartner = async(req, res, next)=>{
    console.log("came for assign paretner");
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

let getAssignedOrder = async(req, res, next)=>{
    //query Order 

    const {userId} = req.userInfo;
    let avaialbleStatus = [
        'pickupAssigned',
        'collectionDone',
        'deliveryToShopStarted',
    ]
    const fetchOrder = async ()=>{
        let query = {
            where:{
                wishmasterId:userId,
                status:{[Op.in]:avaialbleStatus}
                
            }
        };

        try{
            let orderRes = await OrderShipment.findAll(query);
            res.json({data:orderRes})
        }catch(err){
            console.log("Error is",err);
            Promise.reject("Not able to get assigned Order");
        }
    }
    

    try{
        await fetchOrder();
    }catch(err){
        next(err);
    }
}

let getOptedServices = async(req, res, next)=>{
    let fetchServices = async ()=>{
        const {orderId} = req.query;
        console.log("order is",orderId);
        let query = {
            where:{
                orderId:orderId
            }
        }
        return await OrderServices.findAll(query);
    }

    try{
        let servicesRes = await fetchServices();
        res.json({data:servicesRes});
    }catch(err){
        console.log("Error is",err);
        next(err);
    }
}

let addOrderDetails = async (req, res, next)=>{
    //add in orderdetails table

    const {serviceName,quantity, unit,orderId,cloth,serviceId} = req.body;

    let addQuery = {
        orderId:orderId,
        serviceName:serviceName,
        quantity:quantity,
        unit:unit,
        cloth:cloth,
        serviceId:serviceId
    }
    try{
        let addRes = await OrderDetails.create(addQuery);
        res.status(200).json({msg:"Service added successfully",data:addRes});
    }catch(err){
        next(err);
    }



    
}

let updateOrderDetails = async (req, res, next) =>{
    const {orderId,OrderDetailId,serviceName,quantity} = req.body;

    let updateQuery = {
        where:{
            id:OrderDetailId,
            orderId:orderId
        },
        serviceName:serviceName,
        quantity:quantity
        
    }
    try{
        await OrderDetails.update(updateQuery);
        res.status(200).json({msg:"Service updated successfully"});
    }catch(err){
        next(err);
    }
}

let deleteOrderDetails = async (req, res, next) =>{
    const {orderDetailId} = req.body;

    let destroyQuery = {
        where:{
            id:orderDetailId
        }
    }
    try{
        await OrderDetails.destroy(destroyQuery);
        res.status(200).json({msg:"Service removed  successfully"});
    }catch(err){
        console.log("error is",err);
        next(err);
    }
}
let getOrderDetails = async(req, res, next)=>{
    const {orderId} = req.query;
    let query = {
        where:{orderId:orderId}
    }

    try{
        let details = await OrderDetails.findAll(query);
        let services = await OrderServices.findAll(query);
        res.json({clothes:details,services:services});
    }catch(err){
        console.log("Error in getting orderdetails",err);
        next(err);
    }
    

}

const getShipment = (req, res, next)=>{

}

const setDeliveryParnterAvailable = async  (req,status)=>{
    const { userId } = req.userInfo;
    const {orderId} = req.body;

    const sendDeliveryAck = async ()=>{
        let order = await OrderShipment.findOne({where:{orderId:orderId}});
        axiosObj.setConfig({app:'msgQ',token:""});
        return await axiosObj.postRequest('/ack',{deliveryTag:order.deliveryTag});
    }

    if(status == 'deliveryToShopDone') {
        await sendDeliveryAck();
        axiosObj.setConfig({app:'main',token:req.token});
        return await axiosObj.putRequest('/auth/user',{userId:userId});
    }else{
        return Promise.resolve({"msg":"Time has not come to ack"});
    }

}

const updateShipment = async (req, res, next)=>{
    const {orderId,status} = req.body;
    let updateQuery = {
        status:status
    }
    let whereQuery ={where:{orderId:orderId}};

    try{
        await OrderShipment.update(updateQuery,whereQuery);
        await setDeliveryParnterAvailable(req,status);
        res.json({msg:"Order updated Successfully"});
    }catch(err){
        console.log("error is",err);
        next(err);
    }
}

const fetchOrders = async (req, res,next)=>{
    let {userId} = req.userInfo;
    try{
        let orders = await Orders.findAll({where:{
                            userId:userId,

                        },
                        order:[['updatedAt','DESC']],
                        limit:10
        });
        res.json({data:orders});
    }catch(err){
        next(err);
    }
    

    
}

const addShipment = (req, res, next)=>{

}

const deleteShipment = (req, res, next)=>{

}

const updateDeliveryTag = async (req, res, next)=>{
    const {orderId,deliveryTag} = req.body;

    const updateQuery = {
        deliveryTag:deliveryTag
    }
    const whereQuery  = {
        where:{orderId:orderId}
    }

    try {
        await OrderShipment.update(updateQuery,whereQuery); 
        res.json({msg:"Delivery tag updated",orderId:orderId, deliveryTag:deliveryTag,updated:1});
    } catch(err) {
        console.log("err is ",err);
        next(err);
    }
   

}




module.exports = {
    test,
    createNewOrder,
    assignDeliveryPartner,
    getAssignedOrder,
    getOptedServices,
    addOrderDetails,
    updateOrderDetails,
    deleteOrderDetails,
    getOrderDetails,
    getShipment,
    addShipment,
    updateShipment,
    deleteShipment,
    fetchOrders,
    updateDeliveryTag

}


