const express = require('express');
const sequelize = require('./database');
const properties = require('./dt_models/properties');
const tasklog = require('./dt_models/tasklogs');

const app = express();
const PORT = 3000;

// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Подключение статических файлов
app.use(express.static('./public'));

// Маршрут для главной страницы
app.get('/', (req, res) => {
  console.log('Rendering index.ejs');
  res.render('index'); // Рендерит файл views/index.ejs
});

// Маршрут для первой страницы
app.get('/page1', async (req, res) => {
  console.log('Rendering page1.ejs');
  try {
    // Получение данных из базы
    const data = await properties.findAll({
      attributes: ['source', [sequelize.fn('COUNT', sequelize.col('source')), 'count']],
      group: ['source'],
      order: [[sequelize.fn('COUNT', sequelize.col('source')), 'DESC']]
    });

    // Форматируем данные для передачи в шаблон
    const chartData = data.map(row => ({
      source: row.source,
      count: row.dataValues.count
    }));
    console.log(chartData);

    res.render('page1', { chartData });
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/page2', async (req, res) => {
  try {
    // Получение данных для 10 самых популярных станций
    const topStations = await properties.findAll({
      attributes: ['metro', [sequelize.fn('COUNT', sequelize.col('metro')), 'count']],
      group: ['metro'],
      order: [[sequelize.fn('COUNT', sequelize.col('metro')), 'DESC']],
      limit: 10
    });

    // Получение данных для остальных станций
    const otherStations = await properties.findAll({
      attributes: ['metro', [sequelize.fn('COUNT', sequelize.col('metro')), 'count']],
      group: ['metro'],
      order: [[sequelize.fn('COUNT', sequelize.col('metro')), 'DESC']],
      offset: 10
    });

    // Форматируем данные для передачи в шаблон
    const chartData = topStations.map(row => ({
      metro: row.metro,
      count: row.dataValues.count
    }));

    const otherStationsList = otherStations.map(row => ({
      metro: row.metro,
      count: row.dataValues.count
    }));

    res.render('page2', { chartData, otherStationsList });
  } catch (error) {
    console.error('Ошибка при обработке маршрута /page2:', error);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/page3', async (req, res) => {
  try {
    // Получение данных из базы данных
    const averagePrices = await properties.findAll({
      attributes: ['source', [sequelize.fn('AVG', sequelize.col('price')), 'average_price']],
      group: ['source'],
      order: [[sequelize.fn('AVG', sequelize.col('price')), 'DESC']]
    });

    // Форматируем данные для передачи в шаблон
    const chartData = averagePrices.map(row => ({
      source: row.source,
      averagePrice: parseFloat(row.dataValues.average_price).toFixed(2) // Преобразуем в число с двумя знаками после запятой
    }));

    res.render('page3', { chartData });
  } catch (error) {
    console.error('Ошибка при обработке маршрута /page3:', error);
    res.status(500).send('Ошибка сервера');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});