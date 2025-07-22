const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const { console } = require('inspector');

// URL страницы, которую нужно спарсить
const BaseUrl = encodeURI('https://www.mirkvartir.ru/Москва/');

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function parsePages(url, pages){
    let results = [];
    for( let i = 1; i < pages+1; i++){
        newUrl = url + `?p=${i}`;

        results.push(parsePage(newUrl));
        await sleep(5000)

        console.log(`${i} page parsed`)
        console.log(results);
    }

    results = results.flat();

    // Сохраняем результат в JSON-файл
    fs.writeFile('Jsons/data-mirkv.json', JSON.stringify(results, null, 2), (err) => {
        if (err) throw err;
        console.log('Данные успешно сохранены в data-mirkv.json');
    });
}

function parsePage(url, page = 1) {
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
            $('div[class*="OffersListItem_infoContainer"]').each((index, element) => {
                const title = $(element).find('div[class*="OffersListItem_offerTitleContainer"] > a > span').text().trim();
                const price = $(element).find('div[class*="OffersListItem_rightContainer"] span[class*="OfferPrice_price_"] ').text().trim().replace(/\s/g,'').slice(0,-1);
                const location = $(element).find('div[class*="OfferAddress_address"]').text().trim();
                const metro = $(element).find('div[class*="PlaceAround"] > a > span').text().trim();
                const description = $(element).find('div[class*="OffersListItem_infoText"]').text().trim();
                const link = $(element).find('a[class*="OffersListItem_offerTitle"]').attr('href');

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