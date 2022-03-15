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
 const {Orders, OrderDetails, OrderServices, OrderShipment,OrderServiceDetails} = db;
 const {OrderParticulars,OrderQuantities} = db

 const axiosObj = require('../services/axios');
 const { Query } = require('mongoose');
 const OrderUpdateSerivice = require('../services/orderUpdates');
 const OrderService = require('../services/order');

let test =(req, res)=>{
    res.send("test called in Cart, thanks for calling");
}

let createNewOrder = async (req, res, next)=>{
    let getCart = async ()=>{
        axiosObj.setConfig({app:'cart',token:req.token});
        try{
            return await axiosObj.getRequest('/cart/');
        }catch(err){
            throw new Error(err);
        }           
    }
    let createOrder = async (cart) => {
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
            let eachService = cart[i].service;
            let {serviceId} = eachService;
            axiosObj.setConfig({app:'main',token:req.token});
            let serviceRow = await axiosObj.getRequest('/merchant/service/details/'+serviceId);
            console.log("service id",serviceRow.data);
            let {MerchantServiceDetails,id,createdAt,updatedAt,...orderServiceRow} = serviceRow.data.payload;
            orderServiceRow = {...orderServiceRow, orderId:order.id,cartId:cart[0].service.cartId};
            
            try{
                let orderServiceId = await OrderServices.create(orderServiceRow);
                let servicDetailPromises = MerchantServiceDetails.map(element=>{
                    let {id,createdAt,updatedAt,serviceId,...serviceDetailRow} = element;
                    serviceDetailRow = {...serviceDetailRow,serviceId:orderServiceId.id}

                    return OrderServiceDetails.create(serviceDetailRow);

                });
                await Promise.all(servicDetailPromises);
            }catch(err){
                console.log("err is",err);
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
        const {orderId} = req.params;
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

let getServiceAndParticulars = async(req, res)=>{
    let {id} = req.params;
    try{

        let serviceRows = await OrderServices.findOne({
            where:{id:id},
            include:{model:OrderServiceDetails,as:"serviceDetail"}
        });
        let serviceParticulars = await OrderService.orderParticulars({serviceId:id});

        res.json({payload:{services:serviceRows,particulars:serviceParticulars}});
    }catch(err){
        console.log("error is",err);
    } 
}

let addOrderDetails = async (req, res, next)=>{
    //add in orderdetails table

    const {serviceName,quantity,unit,orderId,cloth,serviceId,clothServiceId} = req.body;
    const {hasParticulars} = req.body;

    let addQuery = {
        orderId:orderId,
        serviceName:serviceName,
        quantity:quantity,
        unit:unit,
        cloth:cloth,
        serviceId:serviceId,
        merchantServiceDetailId:clothServiceId,
        hasParticulars:hasParticulars
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

let deleteOrderParticular = async (req, res, next) =>{
    const {particularId} = req.body;
    try{
        await OrderParticulars.update({deleted:true},{where:{id:particularId}});
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

const getShipment = async (req, res, next) => {
    const {orderId} = req.params;
    try{
        let shipmentRow = await OrderShipment.findOne({where:{orderId:orderId}});
        res.json({shipment:shipmentRow});

    }catch(err){
        console.log("Error in getting the shipment details",err);
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

const deliveredOrder = async(req, res,next) => {
    try{
        let orders = await OrderService.getDeliveredOrder({...req.userInfo});
        res.json({msg:"Orders", data:orders});
    }catch(err){
        console.log("Error in getting the delivered orders",err);
        next(err);
    }
    
}   

const addOrderParticular = async (req, res, next) => {
    
    let particularRow = req.body;
    try{
        let createdRow = await OrderParticulars.create(particularRow);
        let {serviceId} = particularRow;
        let createdRowParticulars =await OrderService.singleParticlarRow({serviceId:serviceId,particularId:createdRow.id})
        res.json({payload:createdRowParticulars});
    }catch(err){
        console.log("eror in creating the particular",err);
        next(err);
    }   
}
const getServiceParticulars = async (req, res, next)=>{

    const {serviceId} = req.params;
    let fetchParticulars = async ()=>{
            return  OrderServices.findOne({
                attributes:['id','name'],
                where:{id:serviceId},
                include:{model: OrderParticulars, as:"particulars",include:{model:OrderServiceDetails,as:"serviceDetail"}}
            })
    }
    try{
        let serviceWothParticulars = await fetchParticulars();
        return res.json({payload:{data:serviceWothParticulars}});

    }catch(err){
        console.log("error is",err);
        next(err);
    }
}

const getParticularsInOrder = async (req, res,next)=>{
    const {orderId} = req.params;
    let fetchParticulars = async ()=>{
        return await OrderServices.findAll({
            where:{ 
                orderId: orderId
            },
            include:{model:OrderParticulars,as:"particulars",include:{model:OrderServiceDetails,as:"serviceDetail"}}
        })
    }

    try{
        let rows = await fetchParticulars();
        res.json({payload:rows,status:"success"}).status(200);
    }catch(err){
        console.log("error is",err);
    }
    
}

const insertOrderQuantity = async(req, res, next)=>{
    let {serviceId, quantity} = req.body;
   
    
    let row = {
        serviceId:serviceId,
        quantity:quantity
    }
    try{
        let rowRes = await OrderQuantities.create(row);
        return res.json({payload:rowRes.id,status:"success"}).status(200);
    }catch(err){
        console.log("error is",err);
    }
}

const getOrderSummary = async (req, res, next)=>{

    let {orderId} = req.params;
    try{
        let summary = await OrderService.getOrderSummary({orderId:orderId});
        res.json({"payload":summary});
    }catch(err){
        console.log("error is",err);
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
    deleteOrderParticular,
    getOrderDetails,
    getShipment,
    addShipment,
    updateShipment,
    deleteShipment,
    fetchOrders,
    updateDeliveryTag,
    deliveredOrder,
    getServiceAndParticulars,
    addOrderParticular,
    getServiceParticulars,
    getParticularsInOrder,
    insertOrderQuantity,
    getOrderSummary

}


