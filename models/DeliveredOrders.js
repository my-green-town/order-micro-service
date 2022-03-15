'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class DeliveredOrders extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //define your association here
            DeliveredOrders.belongsTo(models.Orders,{foreignKey:'orderId'});
        }
    };
    DeliveredOrders.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        orderId: { type: Sequelize.STRING },
        shipmentId: { type: Sequelize.INTEGER },
        wishmasterId: { type: Sequelize.INTEGER },
        wishmasterName: { type: Sequelize.STRING },
        deliveryTime: { type: Sequelize.INTEGER },
        distance: { type: Sequelize.INTEGER },
        paymentId:{ type: Sequelize.INTEGER },
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
            modelName: 'DeliveredOrders',
        });
    return DeliveredOrders;
};