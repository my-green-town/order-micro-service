'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderUpdates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId:{
        type: Sequelize.INTEGER,
        references: {
        model: 'Orders',
            key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      status:{
        type: Sequelize.STRING
      },
      updatedBy:{
        type: Sequelize.INTEGER
      },
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
    await queryInterface.dropTable('OrderUpdates');
  }
};