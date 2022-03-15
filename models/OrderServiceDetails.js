'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class OrderServiceDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //define your association here
            OrderServiceDetails.belongsTo(models.Orders, { foreignKey: 'orderId' });
            OrderServiceDetails.belongsTo(models.OrderServices, { foreignKey: 'serviceId' });
            OrderServiceDetails.hasMany(models.OrderParticulars,{foreignKey:'serviceDetailId'});
        }
    };
    OrderServiceDetails.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        orderId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Orders',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        /**
         * serviceId refers to orderService primary key
        */
        serviceId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'OrderServiceDetails', // 'Movies' would also work
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        }, //(debit | credit)
        cloth: { type: Sequelize.STRING }, //shirt, pant, jeans
        unit: { type: Sequelize.STRING }, //kg, peice
        price: { type: Sequelize.INTEGER }, //(card|account)
        discount: { type: Sequelize.INTEGER, defaultValue: 0 },
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
            modelName: 'OrderServiceDetails',
        });
    return OrderServiceDetails;
};