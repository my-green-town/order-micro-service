'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Merchants', [
      {
        name: 'Laundary WALA',
        shopImage:'https://storage.googleapis.com/myluck/laundary/1.jpeg'
        
      },
      {
        name: 'Wash Buddy',
        shopImage:'https://storage.googleapis.com/myluck/laundary/2.jpeg'
      },
      {
        name: 'Bristish Laundary',
        shopImage:'https://storage.googleapis.com/myluck/laundary/3.jpeg'
      
      },
      {
        name: 'WISHERS LAUNDARY',
        shopImage:'https://storage.googleapis.com/myluck/laundary/4.jpeg'
        
      },
      {
        name: 'WHITE COLLAR',
        shopImage:'https://storage.googleapis.com/myluck/laundary/5.jpeg'
        
      },
      {
        name: 'PRISTINE LAUNDARY',
        shopImage:'https://storage.googleapis.com/myluck/laundary/6.jpeg'
      }
    ], {});

    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
