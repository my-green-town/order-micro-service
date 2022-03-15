'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class OrderDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        //define your association here
    }
  };
  OrderDetails.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    cartId : { type:Sequelize.INTEGER},
    orderId:{ type:Sequelize.INTEGER,
      references: {
        model: 'Orders',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    serviceName:{
      type:Sequelize.STRING
    },
    quantity:{
      type:Sequelize.INTEGER
    },
    unit:{
      type:Sequelize.STRING
    },
    cloth:{
      type:Sequelize.STRING
    },
    merchantServiceDetailId:{
      type:Sequelize.INTEGER
    },
    hasParticulars:{
      type:Sequelize.BOOLEAN,
      defaultValue: false
    },
    serviceId:{
      type:Sequelize.INTEGER
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
      modelName: 'OrderDetails',
    });
  return OrderDetails;
};