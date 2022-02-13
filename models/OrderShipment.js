'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class OrderShipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        //define your association here
    }
  };
  OrderShipment.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    status : { type: Sequelize.STRING},
    /**
     * outForPickup | pickupComplete
     * outForDelivery | deliveryComplete
     */
    paymentStatus:{type:Sequelize.BOOLEAN},
    wishmasterId:{type:Sequelize.INTEGER},
    cartId:{type:Sequelize.INTEGER},
    orderId:{type:Sequelize.INTEGER},
    deliveryTag:{type:Sequelize.INTEGER},
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
      modelName: 'OrderShipment',
    });
  return OrderShipment;
};