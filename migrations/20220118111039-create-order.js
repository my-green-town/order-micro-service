'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status : { 
        type:Sequelize.ENUM,
        values: ['PLACED', 'PICKED_UP', 'UNDER_WASH',
          'OUT_FOR_DELIVERY', 'DELIVERED','CANCELLED'
        ],
        defaultValue: "PLACED"
      },
      expectedPickupTime: { type: Sequelize.STRING},
      actulaPickupTime:{type: Sequelize.STRING},
      expectedDeliveryTime:{type:Sequelize.STRING},
      actualDeliveryTime:{type:Sequelize.STRING},
      paymentStatus:{
        type:Sequelize.ENUM,
        values: ['PAID', 'PENDING', 'NOT_PAID'],
        defaultValue: "NOT_PAID"
      },
      merchantName: { type: Sequelize.STRING },
      userId:{type:Sequelize.INTEGER},
      cartId:{type:Sequelize.INTEGER},
      addressId: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable('Orders');
  }
};