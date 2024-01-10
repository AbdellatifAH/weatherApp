const currentWeatherDiv = document.querySelector('.currentWeather');
const futureWeatherDiv = document.querySelector('.futureWeather');
const locationNameDiv = document.querySelector('.locationName');
const form = document.querySelector('#form');
const search = document.querySelector('#location');
const searchBtn = document.querySelector('#submit');

async function getWeatherData(location) {
    try {
        const key = '5550ea411f4a46c3bb2163347240601';
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&days=3&q=${location}`;
        const response = await fetch(url, { 'mode': 'cors' });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

function processWeatherData(data) {
    const locationName = data.location.name;
    const currentForecast = {
        'heading': 'Now',
        'condition': data.current.condition.text,
        'tempC': data.current.temp_c,
        'tempF': data.current.temp_f,
    };
    const futureForecast = [
        {
            'heading': 'Today',
            'date': data.forecast.forecastday[0].date,
            'tempC': data.forecast.forecastday[0].day.avgtemp_c,
            'tempF': data.forecast.forecastday[0].day.avgtemp_f,
            'condition': data.forecast.forecastday[0].day.condition.text,
        },
        {
            'heading': 'Tomorrow',
            'date': data.forecast.forecastday[1].date,
            'tempC': data.forecast.forecastday[1].day.avgtemp_c,
            'tempF': data.forecast.forecastday[1].day.avgtemp_f,
            'condition': data.forecast.forecastday[1].day.condition.text,
        },
        {
            'heading': 'After-Tomorrow',
            'date': data.forecast.forecastday[2].date,
            'tempC': data.forecast.forecastday[2].day.avgtemp_c,
            'tempF': data.forecast.forecastday[2].day.avgtemp_f,
            'condition': data.forecast.forecastday[2].day.condition.text,
        },
    ];
    return { locationName, currentForecast, futureForecast };
}

function createWeatherCard(object) {
    const cardHeading = document.createElement('h3');
    const conditionDiv = document.createElement('div');
    const tempCDiv = document.createElement('div');
    const tempFDiv = document.createElement('div');
    const dateDiv = document.createElement('div');

    cardHeading.textContent = object.heading;
    conditionDiv.textContent = object.condition;
    tempCDiv.textContent = object.tempC;
    tempFDiv.textContent = object.tempF;
    tempFDiv.classList.toggle('hide');
    dateDiv.textContent = object.date;

    const card = document.createElement('div');
    card.classList.toggle('card');
    card.append(cardHeading, conditionDiv, tempCDiv, tempFDiv, dateDiv);
    return card;
}

function render(object) {
    currentWeatherDiv.textContent = '';
    futureWeatherDiv.textContent = '';
    locationNameDiv.textContent = object.locationName;
    const currentWeatherCard = createWeatherCard(object.currentForecast);
    currentWeatherCard.classList.toggle('now');
    currentWeatherDiv.append(currentWeatherCard);

    const forecastArray = object.futureForecast;
    for (let i = 0; i < forecastArray.length; i += 1) {
        const futureWeatherCard = createWeatherCard(forecastArray[i]);
        futureWeatherCard.classList.toggle(`${forecastArray[i].heading}`);
        futureWeatherDiv.append(futureWeatherCard);
    }
}
async function getWeather(location) {
    const unProcessedData = await getWeatherData(location);
    const processedData = processWeatherData(unProcessedData);
    render(processedData);
}

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    getWeather(search.value);
    form.reset();
});

getWeather('Beirut');
