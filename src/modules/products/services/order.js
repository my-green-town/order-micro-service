
const db = require("../../../../models");
const { order } = require("../controllers/index.controller");
const {Sequelize} = db.Sequelize;
const { Op } = Sequelize;
const {DeliveredOrders,OrderServiceDetails,Orders,OrderParticulars,OrderServices} = db;

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
                include:[{
                        model:OrderParticulars,as:"particulars",
                        include:{model:OrderServiceDetails, as:"serviceDetail"}
                    },
                    {model:db.OrderQuantities,as:"orderQuantities"}
                ],
                
            }
        });
        
        let totalCost = 0;

        orderSummary.OrderServices.forEach(element=>{
            let eachServiceCost = 0 ;
            if(element.orderQuantities.length>0){
                //flat-price calculation like kg,pair
                let cost = element.particulars[0].serviceDetail.price;
                element.orderQuantities.forEach(item=>{
                    let serviceCost = item.quantity*cost;
                    totalCost+=serviceCost;
                    item = {...item,cost:serviceCost};
                    item;
                });

            }else{
               
                element.particulars.forEach(item => {
                    let cost = item.count *(item.serviceDetail.price);
                    item = {...item, cost:cost};
                    totalCost+=cost;
                    item;
                    
                });
            }
            element['serviceCost'] = 10000;
        })
        return {orderSummary,totalAmount:totalCost}
    }

    try{
       let summary = await fetchServices();
       return summary;
    }catch(err){
        console.log("Err is",err);
    }
}



module.exports = {
    getDeliveredOrder,
    orderParticulars,
    singleParticlarRow,
    getOrderSummary
}