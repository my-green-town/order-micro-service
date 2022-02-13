module.exports = {
    up: async function(queryInterface, Sequelize) {
      // logic for transforming into the new state
      await queryInterface.addColumn(
        'OrderDetails',
        'cloth',
        Sequelize.STRING
      );
      return await queryInterface.addColumn(
        'OrderDetails',
        'serviceId',
        Sequelize.INTEGER
      );
  
    },
  
    down: function(queryInterface, Sequelize) {
      // logic for reverting the changes
      return queryInterface.removeColumn(
        'Todo',
        'completed'
      );
    }
  }