'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderShipments', {
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
    
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OrderShipments');
  }
};