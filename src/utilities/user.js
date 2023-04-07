const db = require("../../models");
const axiosService = require('../services/axios');
const {OrderShipment} = db

const delivery = {

    getAvailablePartner :async  () =>{
        try {
            axiosService.setConfig({app:'main'});
            const partner = await axiosService.postRequest('/auth/bookDeliveryPartner',{});
            //const {data} = partner;
            // if(data.status == 'PARTNER_BUSY'){
            //     throw new Error('No Delivery Partner available for now. Retrying in some time')
            // }
            return partner.data;
        } catch (err) {
            throw err;
        }
    } 
}


module.exports = {
    delivery
}