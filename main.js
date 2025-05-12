
const fs = require('fs/promises');
const readline = require('readline');
const fetch = require('node-fetch');

// Завантаження конфігурації з файлу
async function loadConfig(filename) {
    const data = await fs.readFile(filename, 'utf-8');
    return JSON.parse(data);
}

// Запит до NewsAPI
async function getDataFromApi(query, apiKey) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
    const response = await fetch(url);

    if (response.status === 200) {
        return await response.json();
    } else {
        console.error(` Помилка запиту: ${response.status}`);
        return null;
    }
}

// Основна функція
async function main() {
    const config = await loadConfig('config.json');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(' Введіть запит для пошуку новин: ', async (query) => {
        const data = await getDataFromApi(query, config.api_key);

        if (data && data.articles && data.articles.length > 0) {
            console.log('\n Результати пошуку:\n');

            data.articles.slice(0, 5).forEach((article, index) => {
                console.log(`${index + 1}. ${article.title}`);
                console.log(`    ${article.publishedAt}`);
                console.log(`    ${article.description}\n`);
            });

            await fs.writeFile('output.json', JSON.stringify(data, null, 2));
            console.log(' Всі дані збережено у файл output.json');
        } else {
            console.log('Нічого не знайдено або помилка відповіді.');
        }

        rl.close();
    });
}

main();
