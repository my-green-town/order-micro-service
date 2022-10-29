const mockAxios = require('axios');
const db = require('../../models')
const { Orders, OrderShipment } = db;

const util = require('./order');
describe('Testing order processing utility',()=>{

    test('check for order is created successfully', async() => { 
        let req  = {
            userInfo:{ userId :134},
            body:{addressId:321}
        }  
        const cartMock = {
            data: [{
                id: '123',
                count: 12,
                service: {
                    cartId: '112'
                }
            },
            {
                id: '124',
                count: 4,
                service: {
                    cartId: '112'
                }
            }
            ],
            cartInfo: { merchantName: "Washer Laundry" }
        }

        jest.spyOn(Orders,"create").mockImplementation(()=>Promise.resolve({id:"9912"}))
        const result =  util.order.create(req,cartMock);
        await expect(result).resolves.toStrictEqual({id:"9912"})

    })

    test('Create order Fails and throws Error', async() => { 
        let req  = {
            userInfo:{ userId :134},
            body:{addressId:321}
        }  
        const cartMock = {
            data: [{
                id: '123',
                count: 12,
                service: {
                    cartId: '112'
                }
            },
            {
                id: '124',
                count: 4,
                service: {
                    cartId: '112'
                }
            }
            ],
            cartInfo: { merchantName: "Washer Laundry" }
        }

        jest.spyOn(Orders,"create").mockImplementation(()=>Promise.reject({id:"9912"}))
        try{
            await util.order.create(req,cartMock);
        }catch(err){
            expect(err).toStrictEqual(new Error("Error in creating the order"))
        }
        

    })

    test('Get latest order successfully',async ()=>{
        let req  = {
            userInfo:{ userId :134},
        } 
        jest.spyOn(Orders,"findAll").mockImplementation(()=>Promise.resolve([{id:"9912"},{id:"123"}]));
        const result = await util.order.getLatest(req)
        expect(result).toStrictEqual([{id:"9912"},{id:"123"}])
    })

    test('Get latest order successfully',async ()=>{
        let req  = {
            orderId:123,
            status:"UPDATE_STATUS"
        } 
        jest.spyOn(Orders,"update").mockImplementation(()=>Promise.resolve({id:"9912"}));
        const result = await util.order.updateStatus(req)
        expect(result).toStrictEqual({id:"9912"})
    })

    test('Order is pushed to shipment table after placed',async()=>{
        let req  = {
            id:12
        } 
        jest.spyOn(OrderShipment,"create").mockImplementation(()=>Promise.resolve({updated:"9912"}));
        await util.orderShipmentHandlers.push(req)

    })

    test('Order is not pushed to shipment and thows Error',async() => {
        let req  = {
            id:12
        } 
        jest.spyOn(OrderShipment,"create").mockImplementation(()=>Promise.reject());
        try {
            await util.orderShipmentHandlers.push(req)
        } catch(err) {
            expect(err).toBeInstanceOf(Error)
            expect(err).toStrictEqual(new Error("Not able to push order to shipment"))
        }
    })

    new Error("Not able to push order to shipment")
})