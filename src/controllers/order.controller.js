/**
 * Apis related to order
 * /order/get
 * /order/put
 * /order/post
 * /order/delete
 */

 const { request, response } = require('express');
 const mongoose = require('mongoose');
 const db = require("../../models");
 const {Sequelize} = db.Sequelize;
 const { Op } = Sequelize;
 const {Orders, OrderDetails, OrderServices, OrderShipment,OrderServiceDetails} = db;
 const {OrderParticulars,OrderQuantities} = db

 const axiosObj = require('../services/axios');
 const { Query } = require('mongoose');
 const OrderUpdateSerivice = require('../services/orderUpdates');
 const OrderService = require('../services/order');
 const CartService = require('../services/') 
 
let test =(req, res)=>{
    res.send("test called in Cart, thanks for calling");
}

let createNewOrder = async (req, res, next)=>{

    try{
        const placeOrderRes = await OrderService.placeOrder(req);
        res.json({msg:"order placed successfully.",payload:placeOrderRes});
    }catch(err){
        console.log("came here for catch",err)
        next(err)
    }
}



let getAssignedOrder = async(req, res, next)=>{
    //query Order 

    const {userId} = req.userInfo;
    
    const fetchOrder = async ()=>{
        let query = {
            where:{
                wishmasterId:userId
                
            },
            order: [
                ['createdAt', 'DESC']
            ],
        };
        return OrderShipment.findOne(query);    
    }
    
    try{
        const result = await fetchOrder();
        if(result) {
            res.json({data:result})
        } else {
            res.status(404).json({msg:"No order Found"})
        }
        
    }catch(err){
        console.log("error is",err)
        next(err);
    }
}

let getOptedServices = async(req, res, next)=>{
    let fetchServices = async ()=>{
        const {orderId} = req.params;
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
    try {

        let serviceRows = await OrderServices.findOne({
            where:{id:id},
            include:{model:OrderServiceDetails,as:"serviceDetail"}
        });
        res.json({payload:{services:serviceRows}});
    } catch(err) {
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




const fetchOrders = async (req, res,next)=>{
    let {userId} = req.userInfo;
    try{
        let orders = await Orders.findAll(
                        {
                        where:{
                            userId:userId,
                        },
                        include:[OrderServices],
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

const getLatestOrderSummary = async(req, res,next)=>{
    try {
        const ordersSummary = await OrderService.fetchOrderSummary(req)
        return res.json(ordersSummary)
    } catch (err) {
        next(err)
    }
}


const servicesAndStatus = async(req, res,next) => {
    try {
        const orderServices = await OrderService.getServicesAndStatus(req)

        return res.json(ordersSummary)
    } catch (err) {
        next(err)
    }
}
    

module.exports = {
    test,
    createNewOrder,
    getAssignedOrder,
    getOptedServices,
    addOrderDetails,
    updateOrderDetails,
    deleteOrderParticular,
    getOrderDetails,
    addShipment,
    deleteShipment,
    fetchOrders,
    updateDeliveryTag,
    deliveredOrder,
    getServiceAndParticulars,
    addOrderParticular,
    getServiceParticulars,
    getParticularsInOrder,
    insertOrderQuantity,
    getOrderSummary,
    getLatestOrderSummary,
    servicesAndStatus
}


