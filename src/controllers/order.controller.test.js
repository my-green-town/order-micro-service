const controller = require('./order.controller');
var service = require('../services/order');
let req = {

}
let res = {
    json:jest.fn()
}
describe('Testing order controller file',()=>{


    test('check new order creation function', async () => {
        //jest.spyOn(service, 'placeOrder').mockResolvedValue(43);
        //const createOrderRes = await controller.createNewOrder(req,res)
    });

})
