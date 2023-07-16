'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkInsert('posts', [
      {
        title: 'First Post',
        content: 'This is the first post.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Second Post',
        content: 'This is the second post.',
        created_at: new Date(),
        updated_at: new Date()
      },
      
    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('posts', null, {});
  }
};
