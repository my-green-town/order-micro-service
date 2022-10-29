const controller = require('./order.controller');
const db = require('../../models');
const {OrderServiceDetails,Orders,OrderServices,OrderShipment} = db;
const {queue} = require('../utilities/messageQueue')
jest.mock('../utilities/messageQueue')
const mockAxios = require('axios');

beforeEach(() => {
    jest.resetModules();
});

describe('Testing order controller file', () => {
    test('check new order creation function', async () => {
        let req = {
            token: "enca2323dadas",
            userInfo: {
                userId: "12345"
            },
            body: {
                addressId: "123"
            }
        
        }
        let res = {
            json: jest.fn()
        }
        

        jest.spyOn(OrderServiceDetails,"create").mockImplementation(()=>Promise.resolve({id:"9912"}))
        jest.spyOn(Orders,"create").mockImplementation(()=>Promise.resolve({id:"9912"}))
        jest.spyOn(OrderServices,"create").mockImplementation(()=>Promise.resolve({id:"9912",serviceId:123}))
        jest.spyOn(OrderShipment,"create").mockImplementation(()=>Promise.resolve({id:"123"}))
        queue.push = jest.fn()

        mockAxios.get.mockResolvedValueOnce({
            data: {
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
        })

        mockAxios.get.mockResolvedValueOnce({
            data: {
                "payload": {
                    "id": 1,
                    "name": "Dry Clean",
                    "unit": "piece",
                    "tat": "1 day",
                    "available": true,
                    "hasParticulars": false,
                    "createdAt": "2022-08-05T08:24:11.000Z",
                    "updatedAt": "2022-08-05T08:24:11.000Z",
                    "MerchantServiceDetails": [
                        {
                            "id": 1,
                            "serviceId": 1,
                            "cloth": "shirt",
                            "unit": "PER_ITEM",
                            "price": 11,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        },
                        {
                            "id": 2,
                            "serviceId": 1,
                            "cloth": "jeans",
                            "unit": "PER_ITEM",
                            "price": 12,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        },
                        {
                            "id": 3,
                            "serviceId": 1,
                            "cloth": "kurti",
                            "unit": "PER_ITEM",
                            "price": 13,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        },
                        {
                            "id": 4,
                            "serviceId": 1,
                            "cloth": "tshirt",
                            "unit": "PER_ITEM",
                            "price": 14,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        },
                        {
                            "id": 5,
                            "serviceId": 1,
                            "cloth": "pant",
                            "unit": "PER_ITEM",
                            "price": 15,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        },
                        {
                            "id": 6,
                            "serviceId": 1,
                            "cloth": "Blazer",
                            "unit": "PER_ITEM",
                            "price": 16,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        },
                        {
                            "id": 7,
                            "serviceId": 1,
                            "cloth": "shirt",
                            "unit": "PER_ITEM",
                            "price": 17,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        }
                    ]
                },
                "status": "success"
            }
        })

        mockAxios.get.mockResolvedValueOnce({
            data:{
                "payload": {
                    "id": 1,
                    "name": "Dry Clean",
                    "unit": "piece",
                    "tat": "1 day",
                    "available": true,
                    "hasParticulars": false,
                    "createdAt": "2022-08-05T08:24:11.000Z",
                    "updatedAt": "2022-08-05T08:24:11.000Z",
                    "MerchantServiceDetails": [
                        {
                            "id": 1,
                            "serviceId": 1,
                            "cloth": "shirt",
                            "unit": "PER_ITEM",
                            "price": 11,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        },
                        {
                            "id": 2,
                            "serviceId": 1,
                            "cloth": "jeans",
                            "unit": "PER_ITEM",
                            "price": 12,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        },
                        {
                            "id": 3,
                            "serviceId": 1,
                            "cloth": "kurti",
                            "unit": "PER_ITEM",
                            "price": 13,
                            "discount": 0,
                            "createdAt": "2022-08-05T08:24:11.000Z",
                            "updatedAt": "2022-08-05T08:24:11.000Z"
                        }
                    ]
                },
                "status": "success"
            }
        })

        mockAxios.delete.mockResolvedValueOnce({
            data:{
                "status": "success"
            }
        })
        await controller.createNewOrder(req, res);
        expect(queue.push.mock.calls.length).toBe(1);
        
    });

    test('Get Order Assingned to WishMaster Successfully', async ()=>{
        let req = {
            token: "enca2323dadas",
            userInfo: {
                userId: "12345"
            },
            body: {
                addressId: "123"
            }
        }

        let res = {
            json: jest.fn()
        }

        jest.spyOn(OrderShipment,"findAll").mockImplementation(()=>Promise.resolve([
                {
                    "id": 16,
                    "status": "MOVING_TO_SHOP",
                    "paymentStatus": null,
                    "wishmasterId": 1,
                    "cartId": null,
                    "orderId": 35,
                    "deliveryTag": 1,
                    "createdAt": "2022-10-20T18:38:12.000Z",
                    "updatedAt": "2022-10-24T21:30:52.000Z"
                }
            ])
        )
        
        await controller.getAssignedOrder(req, res);
        expect(res.json.mock.calls.length).toBe(1);

        
    })

    test('Get Order Assingned to WishMaster with No Order', async ()=>{
        let req = {
            token: "enca2323dadas",
            userInfo: {
                userId: "12345"
            },
            body: {
                addressId: "123"
            }
        }

        let res = {

            json: jest.fn(),
            status:jest.fn().mockReturnThis()
            
        }

        jest.spyOn(OrderShipment,"findAll").mockImplementation(()=>Promise.resolve([]));
        await controller.getAssignedOrder(req, res);
        expect(res.json.mock.calls.length).toBe(1);
        expect(res.status.mock.calls[0][0]).toBe(404);
    })

    test('Get Order Assingned fetch order Fails', async ()=>{
        let req = {
            token: "enca2323dadas",
            userInfo: {
                userId: "12345"
            },
            body: {
                addressId: "123"
            }
        }

        let res = {
            
            json: jest.fn(),
            status:jest.fn().mockReturnThis()
            
        }
        const next = jest.fn()

        jest.spyOn(OrderShipment,"findAll").mockResolvedValueOnce(Promise.reject('Error in fetching order shipment'));
        await controller.getAssignedOrder(req, res, next);
        expect(next.mock.calls.length).toBe(1);

        
    })

    test('Check for opted services by customer when collection clothes', async() => {
        let req = {
            token: "enca2323dadas",
            userInfo: {
                userId: "12345"
            },
            params:{
                orderId:'12'
            }
        }

        let res = {
            
            json: jest.fn(),
            status:jest.fn().mockReturnThis()
        }
        const next = jest.fn()
        const OrderServicesFindAll = [
            {
                "id": 65,
                "orderId": 25,
                "cartId": 121,
                "name": "Dry Clean",
                "unit": "piece",
                "tat": "1 day",
                "available": true,
                "hasParticulars": false,
                "createdAt": "2022-10-17T19:19:19.000Z",
                "merchantId": null,
                "price": null,
                "updatedAt": "2022-10-17T19:19:19.000Z"
            },
            {
                "id": 66,
                "orderId": 25,
                "cartId": 121,
                "name": "Cool Wash",
                "unit": "kg",
                "tat": "1 day",
                "available": true,
                "hasParticulars": true,
                "createdAt": "2022-10-17T19:19:19.000Z",
                "merchantId": null,
                "price": null,
                "updatedAt": "2022-10-17T19:19:19.000Z"
            },
            {
                "id": 67,
                "orderId": 25,
                "cartId": 121,
                "name": "Mint Wash",
                "unit": "kg",
                "tat": "4 day",
                "available": true,
                "hasParticulars": true,
                "createdAt": "2022-10-17T19:19:19.000Z",
                "merchantId": null,
                "price": null,
                "updatedAt": "2022-10-17T19:19:19.000Z"
            }
        ]
        jest.spyOn(OrderServices,"findAll").mockResolvedValueOnce(Promise.resolve(OrderServicesFindAll));
        await controller.getOptedServices(req, res, next);
        expect(res.json.mock.calls[0][0]).toStrictEqual({data:OrderServicesFindAll});
    })

})


