const Property = require('./modelCreation');
const avitoJsonData = require('../Jsons/data-avito.json');
const cianJsonData = require('../Jsons/data-cian.json');
const mirkvJsonData = require('../Jsons/data-mirkv.json');
const moveJsonData = require('../Jsons/data-move.json');

(async () => {
    try {
        // Перебираем массив из JSON и добавляем данные в таблицу
        for (const item of avitoJsonData) {
          try {
            // Проверяем, существует ли запись с таким же "link" (или другим уникальным полем)
            const existingRecord = await Property.findOne({ where: { link: item.link } });
      
            if (!existingRecord) {
              // Если запись не существует, добавляем её
              await Property.create({
                title: item.title,
                price: item.price,
                location: item.location,
                metro: item.metro,
                description: item.description,
                link: item.link,
                source: "Авито"
              });
              console.log(`Added: ${item.title}`);
            } else {
              console.log(`Skipped (already exists): ${item.title}`);
            }
          } catch (innerError) {
            // Логируем ошибку для конкретной строки, но продолжаем обработку остальных
            console.error(`Error processing item: ${item.title}, Error: ${innerError.message}`);
          }
        }
        console.log('Avito data imported successfully.');
    } catch (error) {
        // Ловим общие ошибки
        console.error('Error importing Avito data:', error);
    }

    try {
        // Перебираем массив из JSON и добавляем данные в таблицу
        for (const item of cianJsonData) {
          try {
            // Проверяем, существует ли запись с таким же "link" (или другим уникальным полем)
            const existingRecord = await Property.findOne({ where: { link: item.link } });
      
            if (!existingRecord) {
              // Если запись не существует, добавляем её
              await Property.create({
                title: item.title,
                price: item.price,
                location: item.location,
                metro: item.metro,
                description: item.description,
                link: item.link,
                source: "Циан"
              });
              console.log(`Added: ${item.title}`);
            } else {
              console.log(`Skipped (already exists): ${item.title}`);
            }
          } catch (innerError) {
            // Логируем ошибку для конкретной строки, но продолжаем обработку остальных
            console.error(`Error processing item: ${item.title}, Error: ${innerError.message}`);
          }
        }
        console.log('Cian data imported successfully.');
    } catch (error) {
        // Ловим общие ошибки
        console.error('Error importing Cian data:', error);
    }

    try {
        // Перебираем массив из JSON и добавляем данные в таблицу
        for (const item of mirkvJsonData) {
          try {
            // Проверяем, существует ли запись с таким же "link" (или другим уникальным полем)
            const existingRecord = await Property.findOne({ where: { link: item.link } });
      
            if (!existingRecord) {
              // Если запись не существует, добавляем её
              await Property.create({
                title: item.title,
                price: item.price,
                location: item.location,
                metro: item.metro,
                description: item.description,
                link: item.link,
                source: "Мир квартир"
              });
              console.log(`Added: ${item.title}`);
            } else {
              console.log(`Skipped (already exists): ${item.title}`);
            }
          } catch (innerError) {
            // Логируем ошибку для конкретной строки, но продолжаем обработку остальных
            console.error(`Error processing item: ${item.title}, Error: ${innerError.message}`);
          }
        }
        console.log('Mirkv data imported successfully.');
    } catch (error) {
        // Ловим общие ошибки
        console.error('Error importing Mirkv data:', error);
    }

    try {
      // Перебираем массив из JSON и добавляем данные в таблицу
      for (const item of moveJsonData) {
        try {
          // Проверяем, существует ли запись с таким же "link" (или другим уникальным полем)
          const existingRecord = await Property.findOne({ where: { link: item.link } });
    
          if (!existingRecord) {
            // Если запись не существует, добавляем её
            await Property.create({
              title: item.title,
              price: item.price,
              location: item.location,
              metro: item.metro,
              description: item.description,
              link: item.link,
              source: "Move"
            });
            console.log(`Added: ${item.title}`);
          } else {
            console.log(`Skipped (already exists): ${item.title}`);
          }
        } catch (innerError) {
          // Логируем ошибку для конкретной строки, но продолжаем обработку остальных
          console.error(`Error processing item: ${item.title}, Error: ${innerError.message}`);
        }
      }
      console.log('Move data imported successfully.');
  } catch (error) {
      // Ловим общие ошибки
      console.error('Error importing Move data:', error);
  }
})();