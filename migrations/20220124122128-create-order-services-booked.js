'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderServices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId:{ type:Sequelize.INTEGER,
        references: {
          model: 'Orders',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      cartId : { type:Sequelize.INTEGER},

      /**
       * data copy of merhant service table
       */
      serviceId:  {type:Sequelize.INTEGER},
      serviceName: {type:Sequelize.STRING},
      servicePrice: {type:Sequelize.INTEGER},
      serviceUnit: {type:Sequelize.STRING},
      serviceTat: {type:Sequelize.STRING},
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OrderServices');
  }
};
