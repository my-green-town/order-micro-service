'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    class OrderUpdates extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //define your association here
        }
    };
    OrderUpdates.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        userId:{type: Sequelize.INTEGER},
        userName:{type:Sequelize.STRING},
        orderId : { type: Sequelize.STRING},
        oldStatus: { type: Sequelize.INTEGER},
        changedStatus:{type: Sequelize.INTEGER},
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
            modelName: 'OrderUpdates',
        });
    return OrderUpdates;
};