const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const { console } = require('inspector');

// URL страницы, которую нужно спарсить
const BaseUrl = 'https://www.cian.ru/cat.php?deal_type=sale&engine_version=2&offer_type=flat&region=1&room1=1&room2=1'

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
    fs.writeFile('Jsons/data-cian.json', JSON.stringify(results, null, 2), (err) => {
        if (err) throw err;
        console.log('Данные успешно сохранены в data-cian.json');
    });
}

function parsePage(url) {
    const options = 
    {
        url,
        encoding: null,
        gzip: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 YaBrowser/24.10.0.0 Safari/537.36', 
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
        },
    };
    let resList = [];

    request(options, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const $ = cheerio.load(html);


            // Парсим данные по селекторам
            $('div[data-testid="offer-card"] > div').each((index, element) => {
                const title = $(element).find('span[data-mark="OfferTitle"] > span').text().trim() + ' ' + $(element).find('span[data-mark="OfferSubtitle"] > span').text().trim();
                const price = $(element).find('span[data-mark="MainPrice"]').text().trim().replace(/\s/g,'').slice(0,-1);
                const location = $(element).find('div[class*="labels"]').text().trim();
                const metro = $(element).find('div[data-name="SpecialGeo"] > a[class*="link"] div').text().trim();
                const description = $(element).find('div[data-name="Description"] > p').text().trim();
                const link = $(element).find('div[data-name="LinkArea"] > a').attr('href');
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