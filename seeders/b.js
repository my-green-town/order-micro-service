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

    await queryInterface.bulkInsert('MerchantServices', [
      {
        name: 'Dry Wash',
        price:20,
        unit:'kg',
        tat:'1 day',
        available:true,
        merchantId:1
      },
      {
        name: 'Cool Wash',
        price:30,
        unit:'kg',
        tat:'1 day',
        available:true,
        merchantId:1
       
      },
      {
        name: 'Mint Wash',
        price:40,
        unit:'kg',
        tat:'4 day',
        available:true,
        merchantId:1
      
      },
      {
        name: 'British Clean',
        price:50,
        unit:'item',
        tat:'3 day',
        available:true,
        merchantId:1
        
      },
      {
        name: 'Steam Press',
        price:60,
        unit:'item',
        tat:'1 day',
        available:true,
        merchantId:1
        
      },
      {
        name: 'Normal Press',
        price:70,
        unit:'item',
        tat:'1 day',
        available:true,
        merchantId:1
        
      },


      {
        name: 'Dry Wash',
        price:120,
        unit:'kg',
        tat:'1 day',
        available:true,
        merchantId:2
      },
      {
        name: 'Cool Wash',
        price:130,
        unit:'kg',
        tat:'1 day',
        available:true,
        merchantId:2
       
      },
      {
        name: 'Mint Wash',
        price:140,
        unit:'kg',
        tat:'4 day',
        available:true,
        merchantId:3
      
      },
      {
        name: 'British Clean',
        price:150,
        unit:'item',
        tat:'3 day',
        available:true,
        merchantId:3
        
      },
      {
        name: 'Steam Press',
        price:160,
        unit:'item',
        tat:'1 day',
        available:true,
        merchantId:3
        
      },
      {
        name: 'Normal Press',
        price:170,
        unit:'item',
        tat:'1 day',
        available:true,
        merchantId:4
        
      },

      {
        name: 'Dry Wash',
        price:320,
        unit:'kg',
        tat:'1 day',
        available:true,
        merchantId:5
      },
      {
        name: 'Cool Wash',
        price:430,
        unit:'kg',
        tat:'1 day',
        available:true,
        merchantId:4
       
      },
      {
        name: 'Mint Wash',
        price:240,
        unit:'kg',
        tat:'4 day',
        available:true,
        merchantId:3
      
      },
      {
        name: 'British Clean',
        price:250,
        unit:'item',
        tat:'3 day',
        available:true,
        merchantId:6
        
      },
      {
        name: 'Steam Press',
        price:160,
        unit:'item',
        tat:'1 day',
        available:true,
        merchantId:4
        
      },
      {
        name: 'Normal Press',
        price:170,
        unit:'item',
        tat:'1 day',
        available:true,
        merchantId:5
        
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
