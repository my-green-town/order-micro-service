'use strict';
const { model } = require('mongoose');
const {
    Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class OrderQuantities extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //define your association here
            OrderQuantities.belongsTo(models.OrderServices, { foreignKey: 'serviceId', as :"orderQuantities" });

        }
    };
    OrderQuantities.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
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
        quantity: {
            allowNull: false,
            type: Sequelize.INTEGER,
        },
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
            modelName: 'OrderQuantities',
        });
    return OrderQuantities;
};