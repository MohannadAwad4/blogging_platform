'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: function(queryInterface, Sequelize) {
      return queryInterface.renameColumn('comments', 'postId', 'post_id');
  },

  down: function(queryInterface, Sequelize) {
      //
      return queryInterface.renameColumn('comments', 'post_id', 'postId');
  }
};

