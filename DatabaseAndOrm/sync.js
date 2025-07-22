const sequelize = require('./database'); // Файл с подключением к базе
const Property = require('./modelCreation');
const TaskLog = require('./taskLogModel');

(async () => {
  try {
    await sequelize.authenticate(); // Проверка подключения
    console.log('Connection to the database established successfully.');

    // Создание таблиц на основе моделей
    await TaskLog.sync({force: true});
    await Property.sync({ force: true }); // Удаляет старые таблицы и создает заново
    console.log('All tables were created successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();