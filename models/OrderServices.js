'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class OrderServices extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //define your association here
        }
    };
    OrderServices.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        orderId: { type: Sequelize.INTEGER },
        cartId: { type: Sequelize.INTEGER },
        /**
         * data copy of merhant service table
         */
        serviceId: { type: Sequelize.INTEGER },
        serviceName: { type: Sequelize.STRING },
        servicePrice: { type: Sequelize.INTEGER },
        serviceUnit: { type: Sequelize.INTEGER },
        serviceTat: { type: Sequelize.INTEGER },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
        }
    },
        {
            sequelize,
            modelName: 'OrderServices',
        });
    return OrderServices;
};