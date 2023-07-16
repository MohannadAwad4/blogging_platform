'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkInsert('comments', [
      {
        
        content: 'This is the first Comment.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
       
        content: 'This is the second Comment.',
        created_at: new Date(),
        updated_at: new Date()
      },
      
    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('comments', null, {});
  }
};
