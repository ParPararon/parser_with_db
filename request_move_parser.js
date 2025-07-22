const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const { console } = require('inspector');

// URL страницы, которую нужно спарсить
const BaseUrl = 'https://move.ru/kvartiry/prodazha_dvuhkomnatnih_kvartir/';

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function parsePages(url, pages){
    let results = [];
    for( let i = 1; i < pages+1; i++){
        newUrl = url + `?page=${i}&limit=30`;

        results.push(parsePage(newUrl));
        await sleep(5000)

        console.log(`${i} page parsed`)
        console.log(results);
    }

    results = results.flat();

    // Сохраняем результат в JSON-файл
    fs.writeFile('Jsons/data-move.json', JSON.stringify(results, null, 2), (err) => {
        if (err) throw err;
        console.log('Данные успешно сохранены в data-move.json');
    });
}

function parsePage(url) {
    const options = 
    {
        url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 YaBrowser/24.10.0.0 Safari/537.36', 
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        },
    };
    let resList = [];

    request(options, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html);
            // Парсим данные по селекторам
            $('div[class="search-item move-object"]').each((index, element) => {
                const title = $(element).find('div[class="search-item__header-left"] a[class*="__title-link search"]').text().trim().replace(/\s/g,'');
                const price = $(element).find('span[class="search-item__price-first"]').text().trim().replace(/\s/g,'').slice(0,-1);
                const location = $(element).find('div[class="geo-block__geo-info"]').text().trim().replace(/\s/g,'');
                const metro = $(element).find('span[class*="search-item__metro"]').text().trim();
                const description = $(element).find('p[class="search-item__description "]').text().trim();
                const link = $(element).find('a[class="search-item__link-overlay"]').attr('href');

                // Добавляем объект с данными в массив
                resList.push({ title, price, location, metro, description, link });
            });
        } else {
            console.error('Ошибка при загрузке страницы:', error);
            console.error('Код ошибки:', response.statusCode );
        }
    })
    return resList;
}

parsePages(BaseUrl, 5)