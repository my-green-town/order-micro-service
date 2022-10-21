const axiosObj = require('../services/axios');
const merchant = {
    //fetches multiple services
    getServices: function (){

    },

    //fetches single service with details
    getService: async function(token,serviceId){
        axiosObj.setConfig({app:'main',token:token});
        const serviceWithItems =  await axiosObj.getRequest('/merchant/service/details/'+serviceId);
        return serviceWithItems.data;
    }
} 

module.exports = {
    merchant
}