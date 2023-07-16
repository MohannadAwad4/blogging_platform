'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
   
    static associate(models) {
      this.belongsTo(models.User);
      this.hasMany(models.Comment)
    }
  }
  Post.init(
    {
    title: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    content: { 
      type:DataTypes.STRING,
      allowNull:false,
    }
  },
   {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    underscored: true,
  });
  return Post;
};