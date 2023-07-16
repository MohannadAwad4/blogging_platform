'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: function(queryInterface, Sequelize) {
      return queryInterface.renameColumn('posts', 'userId', 'user_id');
  },

  down: function(queryInterface, Sequelize) {
      //
      return queryInterface.renameColumn('posts', 'user_id', 'userId');
  }
};
