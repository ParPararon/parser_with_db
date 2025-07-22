const { Sequelize } = require('sequelize');

// Настройка подключения к базе данных
const sequelize = new Sequelize('parse_project', 'parse_project_user', '00000000', {
    host: 'localhost',       // Адрес сервера базы данных
    dialect: 'postgres',     // Указываем, что используем PostgreSQL
    logging: false,          // Отключить логирование SQL-запросов (опционально)
    define: {
      freezeTableName: true, // Не переименовывать таблицы (таблица = модель)
      timestamps: true       // Добавлять поля createdAt и updatedAt
    }
  });

  (async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection to PostgreSQL has been established successfully.');
        } catch (error) {
            console.error('Error syncing database:', error);
        }
  })();

  module.exports = sequelize;