const { DataTypes} = require('sequelize');
const sequelize = require('../database');

const TaskStatusLog = sequelize.define('TaskStatusLog', {
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    task_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    scheduled_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'task_status_log',
    timestamps: false
  });
  
  module.exports = TaskStatusLog;