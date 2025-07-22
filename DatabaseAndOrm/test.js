const sequelize = require('./database');
const { DataTypes } = require('sequelize');

const Example = sequelize.define('Example', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Синхронизация и проверка
(async () => {
  try {
    await sequelize.sync({ force: true }); // Пересоздание таблиц
    console.log('Database synced successfully.');
    
    // Добавление примера записи
    await Example.create({ name: 'Test Entry' });
    console.log('Test Entry added.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();