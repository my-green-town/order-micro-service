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
            OrderServices.belongsTo(models.Orders, {foreignKey:'orderId'});
            OrderServices.hasMany(models.OrderServiceDetails,{foreignKey:"serviceId",as:"serviceDetail"});
            OrderServices.hasMany(models.OrderParticulars,{foreignKey:'serviceId',as:"particulars"});
            OrderServices.hasMany(models.OrderQuantities,{foreignKey:'serviceId',as:"orderQuantities"});
            
        }
    };
    OrderServices.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        /**
         * primary key of merchant-services table
         */
        // merchantServiceId: {
        //     type: Sequelize.INTEGER
        // },
        orderId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Orders',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        cartId: { type: Sequelize.INTEGER },

        /**
         * data copy of merhant service table
         */
        name: { type: Sequelize.STRING },
        unit: { type: Sequelize.STRING },
        tat: { type: Sequelize.STRING },
        available: { type: Sequelize.BOOLEAN },
        hasParticulars: {
            type: Sequelize.BOOLEAN
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
        },
        merchantId: {
            type: Sequelize.INTEGER,
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        price: { type: Sequelize.NUMBER },
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