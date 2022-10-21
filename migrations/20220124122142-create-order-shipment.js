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
      status : { type: Sequelize.ENUM,
        values:[
          'PICK_UP_PARTNER_WAIT',
          'PICK_UP_PARTNER_ASSIGNED',
          'PICK_UP_PARTNER_ARRIVED',
          'PICK-UP_COMPLETE',
          'DROP_AT_SHOP_COMPLETE',
          'DELIVERY_PARTNER_WAIT',
          'DELIVERY_PARTNER_ASSIGNED',
          'OUT_FOR_DELIVERY',
          'DELIVERY_COMPLETE'
        ],
        defaultValue:"PICK_UP_PARTNER_WAIT"
      },
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