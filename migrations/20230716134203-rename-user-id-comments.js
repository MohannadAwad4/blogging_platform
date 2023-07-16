'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: function(queryInterface, Sequelize) {
      return queryInterface.renameColumn('comments', 'userId', 'user_id');
  },

  down: function(queryInterface, Sequelize) {
      //
      return queryInterface.renameColumn('comments', 'user_id', 'userId');
  }
};
