'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class Orders extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Orders.hasMany(models.DeliveredOrders, { foreignKey: 'orderId' });
            Orders.hasMany(models.OrderServices, { foreignKey: 'orderId' });

        }
    };
    Orders.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        status: {
            type:Sequelize.ENUM,
            values: ['PLACED', 'PICKED_UP', 'UNDER_WASH',
            'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
            ],
            defaultValue: "PLACED"
               
        },
        expectedPickupTime: { type: Sequelize.STRING },
        actulaPickupTime: { type: Sequelize.STRING },
        expectedDeliveryTime: { type: Sequelize.STRING },
        actualDeliveryTime: { type: Sequelize.STRING },
        paymentStatus: { type: Sequelize.BOOLEAN },
        merchantName: { type: Sequelize.STRING },
        userId: { type: Sequelize.INTEGER },
        cartId: { type: Sequelize.INTEGER },
        addressId: { type: Sequelize.INTEGER },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }

    },
        {
            sequelize,
            modelName: 'Orders',
        });
    return Orders;
};