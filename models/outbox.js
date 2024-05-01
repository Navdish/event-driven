'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Outbox extends Model {
    static associate(models) {
    }
  }
  Outbox.init({
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    status:{
      type: DataTypes.ENUM('PENDING', 'SUCCESS'),
      defaultValue: 'PENDING'
    } 
  }, {
    sequelize,
    modelName: 'Outbox',
  });
  return Outbox;
};