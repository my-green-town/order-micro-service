const axiosObj = require('../services/axios');
const db = require('../../models')
const { OrderServices, OrderServiceDetails } = db;
const merchantService = require('../services/merchant-service');
const userCart = {
    get:async function(token){
        axiosObj.setConfig({app:'cart',token:token});
        let cartItems = await axiosObj.getRequest('/cart/');
        if(cartItems.data.status == 'error'){
            let errObj =  new Error("Please select some items. No items found in Cart");
            errObj.status = 400;
            throw errObj;
        }  
        return cartItems;
    },
    //delete the cart items after order is placed
    clear: async function(token,cartId){
        axiosObj.setConfig({app:'cart',token:token});
        let cartItems = await axiosObj.deleteRequest('/cart/delete/',{cartId:cartId});
        return cartItems;    
    }
}
const createACopyOfCart = async(token,cart,order) => {
    console.log("cart is",cart);
    for(let i=0;i<cart.length;i++){
        let eachService = cart[i].service;
        let {serviceId} = eachService;
        const  cartId = cart[0].service.cartId
        let serviceRow = await merchantService.merchant.getService(token,serviceId)
        let {MerchantServiceDetails,id,createdAt,updatedAt,...orderServiceRow} = serviceRow.payload;
        orderServiceRow = {...orderServiceRow, 
            orderId:order.id,
            cartId:cartId
        };
        
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
    return "Services and service details captured";
}

module.exports={
    userCart,
    createACopyOfCart
}