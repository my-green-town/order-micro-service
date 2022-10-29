const mockAxios = require('axios');
const db = require('../../models')
const { OrderServices, OrderServiceDetails,OrderShipment } = db;
const util = require('./shipment')
describe(('Shipment Util Test Suit starts here'),()=>{

    test('update shipment status', async () =>{
        jest.spyOn(OrderShipment,"update").mockImplementation(()=>Promise.resolve({updated:1}))
        const params = {orderId:"123",status:"UPDATE_STATUS"}
        await expect(util.shipment.updateStatus(params)).resolves.toStrictEqual({updated:1})
    })

    test('update shipment status Fails with Error', async () => {
        jest.spyOn(OrderShipment,"update").mockImplementation(()=>Promise.resolve())
        const params = {orderId:"123",status:"UPDATE_STATUS"}
        try{
            await util.shipment.updateStatus(params)
        }catch(err){
            expect(err).toBeStrictEqual(new Error('Shipment status update error'))    
        }
    })


    test('Fetch shipment Order ', async () =>{
        jest.spyOn(OrderShipment,"findOne").mockImplementation(()=>Promise.resolve({id:"123"}))
        const params = {orderId:"123"}
        await expect(util.shipment.getsingleOrder(params)).resolves.toStrictEqual({id:"123"})
    })
    
    test('Fetch shipment Order Fails with an Error', async () =>{
        jest.spyOn(OrderShipment,"findOne").mockImplementation(()=>Promise.resolve({id:"123"}))
        const params = {orderId:"123"}
        try{
            await util.shipment.getsingleOrder(params)
        }catch(err){
            expect(err).toBeStrictEqual(new Error('Error in getting order shipment details'))
        }
        
    })
})