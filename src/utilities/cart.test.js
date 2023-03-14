const mockAxios = require('axios');
const db = require('../../models')
const { OrderServices, OrderServiceDetails } = db;
const merchantService = require('../services/merchant-service');
const cartUtil = require('./cart')
beforeEach(() => {
    jest.resetModules();
});

describe('Testing order controller file', () => {
    test('Fetch User cart added Items', async () => {
        let token = 'eddddddddddddeewewabcd12312312132eeww';
        mockAxios.get.mockResolvedValueOnce({
            data: [{ id: 123, count: 1 }, { id: 124, count: 2 }, { id: 123, count: 3 }]
        })
        const userCart = await cartUtil.userCart.get(token);
        expect(userCart.data).toHaveLength(3)
    });

    test('Error in getting the User Cart', async () => {
        let token = 'eddddddddddddeewewabcd12312312132eeww';
        mockAxios.get.mockResolvedValueOnce(Promise.resolve({ data: { status: "error" } }))
        try {
            await cartUtil.userCart.get(token)
        } catch (err) {
            expect(err).toStrictEqual(new Error('Please select some items. No items found in Cart'))
        }
    });

    test('Create Service and service details snapshot for placed order', async () => {

        let token = 'eddddddddddddeewewabcd12312312132eeww';
        jest.spyOn(OrderServiceDetails,"create").mockImplementation(()=>Promise.resolve({id:"9912"}))
        jest.spyOn(OrderServices,"create").mockImplementation(()=>Promise.resolve({id:"9912",serviceId:123}))

        const cart = {
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
        const order = {
            id:123
        }
        const result = await cartUtil.createACopyOfCart(token,cart, order);
        expect(result).toBe('Services and service details captured.');
    })
})


