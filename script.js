const container = document.querySelector('#container');

const topDiv = document.createElement('div');
topDiv.classList.add('topDiv');

const leftDiv = document.createElement('div');
leftDiv.classList.add('leftDiv');

const rightDiv = document.createElement('div');
rightDiv.classList.add('rightDiv');

const bottomDiv = document.createElement('div');
bottomDiv.classList.add('bottomDiv');

const city = document.createElement('h2');

const temp = document.createElement('h1');

const state = document.createElement('p');

const range = document.createElement('div');
range.classList.add('range');

const lo = document.createElement('p');

const hi = document.createElement('p');

const description = document.createElement('p');

const buttonDiv = document.createElement('div');
buttonDiv.classList.add('buttonDiv');

const searchBtn = document.createElement('img');
searchBtn.src = './assets/search.svg';

const unitBtn = document.createElement('img');

buttonDiv.append(searchBtn, unitBtn);

topDiv.append(leftDiv, rightDiv);
leftDiv.append(city, temp);
rightDiv.append(state, range);
range.append(lo, hi);
bottomDiv.append(description, buttonDiv);
container.append(topDiv, bottomDiv);

// functions

function getUserLocation() {
    const dialog = document.querySelector('#locationDialog');
    const form = document.querySelector('#locationForm');
    const input = document.querySelector('#locInput');

    document.addEventListener('DOMContentLoaded', () => {
        urlLocation = 'Buenos Aires';
        getInfo(urlLocation);
    });

    searchBtn.addEventListener('click', () => {
        dialog.showModal();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        urlLocation = input.value;
        getInfo(urlLocation);
        dialog.close();
    });

}

async function getInfo(userLocation) {
    const API_KEY = 'B9K6PEQWEHK2N72V2YX5WGS6S';
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userLocation}?key=${API_KEY}`);
        const weatherData = await response.json();
        console.log(weatherData);

        city.textContent = weatherData.resolvedAddress;
        temp.textContent = `${weatherData.currentConditions.temp} ºF`;
        state.textContent = weatherData.currentConditions.conditions;
        lo.textContent = `Min: ${weatherData.days[0].tempmin} ºF`;
        hi.textContent = `Max: ${weatherData.days[0].tempmax} ºF`;
        let isCelsius = false;
        unitBtn.src = './assets/celsius.svg';
        description.textContent = weatherData.description;

        unitBtn.addEventListener('click', () => {
            if (!isCelsius) {
                temp.textContent = `${convertUnit(weatherData.currentConditions.temp)} ºC`;
                lo.textContent = `Min: ${convertUnit(weatherData.days[0].tempmin)} ºC`;
                hi.textContent = `Max: ${convertUnit(weatherData.days[0].tempmax)} ºC`;
                isCelsius = true;
                unitBtn.src = './assets/fahrenheit.svg';
            } else {
                temp.textContent = `${weatherData.currentConditions.temp} ºF`;
                lo.textContent = `Min: ${weatherData.days[0].tempmin} ºF`;
                hi.textContent = `Max: ${weatherData.days[0].tempmax} ºF`;
                isCelsius = false;
                unitBtn.src = './assets/celsius.svg';
            }
        });

        const currentTimeEpoch = weatherData.currentConditions.datetimeEpoch;
        const sunriseEpoch = weatherData.currentConditions.sunriseEpoch;
        const sunsetEpoch = weatherData.currentConditions.sunsetEpoch;

        if ((currentTimeEpoch > sunriseEpoch) && (currentTimeEpoch < sunsetEpoch)) {
            container.classList.add('clearDay');
            container.classList.remove('clearNight');
        } else {
            container.classList.add('clearNight');
            container.classList.remove('clearDay');
        }
    } catch {
        alert(new Error('400 BAD REQUEST'));
    }
}

function convertUnit(f) {
    let c = (f - 32) / 1.8;
    return c.toFixed(1);
}

getUserLocation();