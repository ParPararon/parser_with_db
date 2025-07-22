const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const { hrtime } = require('process');

// URL страницы, которую нужно спарсить
const BaseUrl = 'https://www.avito.ru/moskva/kvartiry/prodam-ASgBAgICAUSSA8YQ?context=H4sIAAAAAAAA_0q0MrSqLraysFJKK8rPDUhMT1WyLrYyNLNSKk5NLErOcMsvyg3PTElPLVGyrgUEAAD__xf8iH4tAAAA';

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function parsePages(url, pages){
    let results = [];
    for( let i = 1; i < pages+1; i++){
        newUrl = url + `&p=${i}`;

        results.push(parsePage(newUrl));
        await sleep(5000)

        console.log(`${i} page parsed`)
        console.log(results);
    }

    results = results.flat();

    // Сохраняем результат в JSON-файл
    fs.writeFile('Jsons/data-avito.json', JSON.stringify(results, null, 2), (err) => {
        if (err) throw err;
        console.log('Данные успешно сохранены в data-avito.json');
    });
}

function parsePage(url) {
    const options = 
    {
        url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36', 
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        },
    };
    let resList =[]

    request(options, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html);
            // Парсим данные по селекторам
            $('div[data-marker="catalog-serp"] > div[data-marker="item"]').each((index, element) => {
                const title = $(element).find('div[class^="iva-item-title-"]').text().trim();
                const price = $(element).find('p[data-marker="item-price"]').text().trim().replace(/\s/g,'').slice(0,-1);
                const location = $(element).find('div[class^="geo-root-"]>p>span[title]').text().trim();
                const metro = $(element).find('div[class^="geo-root-"]>p>a').text().trim();
                const description = $(element).find('div[class*="item-description"] > p').text().trim();
                const link = "https://www.avito.ru" + $(element).find('a[itemprop="url"][data-marker="item-title"]').attr('href');
            
                // Добавляем объект с данными в массив
                resList.push({ title, price, location, metro, description, link});
            });
        } else {
            console.error('Ошибка при загрузке страницы:', error);
        }
    })
    return resList;
}

parsePages(BaseUrl, 5)