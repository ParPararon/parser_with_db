const { DataTypes} = require('sequelize');
const sequelize = require('../database');

const Property = sequelize.define('Property', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING
    },
    metro: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    link: {
        type: DataTypes.TEXT
    },
    source: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false 
  });

  module.exports = Property;