'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('OrderParticulars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceDetailId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'OrderServiceDetails',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      serviceId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'OrderServices',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      count : { type: Sequelize.INTEGER},
      deleted:{type: Sequelize.BOOLEAN},
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('OrderParticulars');
  }
};
