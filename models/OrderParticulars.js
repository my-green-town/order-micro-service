'use strict';
const { model } = require('mongoose');
const {
    Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class OrderParticulars extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //define your association here
            OrderParticulars.belongsTo(models.OrderServices,{foreignKey:'serviceId',as:"particulars"});
            OrderParticulars.belongsTo(models.OrderServiceDetails,{foreignKey:'serviceDetailId',as:"serviceDetail"});

        }
    };
    OrderParticulars.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        serviceDetailId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'OrderServiceDetails',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        serviceId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'OrderServices',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        count: { type: Sequelize.INTEGER },
        deleted:{type: Sequelize.BOOLEAN},
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
            modelName: 'OrderParticulars',
        });
    return OrderParticulars;
};