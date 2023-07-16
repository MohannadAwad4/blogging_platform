// migrations/XXXXXXXXXXXXXX-add-user-id-to-job-applications.js
"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("comments", "postId", {
      type: Sequelize.INTEGER,
      references: {
        model: "posts", // you can use the table name here
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("comments", "postId");
  },
};
