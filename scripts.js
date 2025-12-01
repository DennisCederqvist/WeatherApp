import { saveData, showData, setManager } from './saveLocal.js';
import { WeatherService } from "./weatherByCity.js";
import { WeatherCardManager } from "./weatherCardManager.js";

const result = document.getElementById("weatherResult");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const cityDropdown = document.getElementById("cityDropdown");


const manager = new WeatherCardManager(result);
setManager(manager);

const service = new WeatherService();

searchBtn.addEventListener("click", showWeather);

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        showWeather();
    }
});

cityInput.addEventListener("input", handleCityInput);

async function showWeather() {
    const city = cityInput.value.trim().toLowerCase();
    const data = await service.getWeatherByCity(city);

    if (!data) {
        showError("⚠️ Staden finns inte i systemet");
        return;
    }

    manager.addCard(data);
    saveData();  

    cityInput.value = "";
}

async function updateWeatherCards() {
    await manager.updateAll();
    saveData(); 
}

function showError(msg) {
    let err = document.getElementById("weatherError");

    if (!err) {
        err = document.createElement("p");
        err.id = "weatherError";
        err.className = "error";
    }

    err.textContent = msg;
    err.style.color = "red";
    err.hidden = false;

    result.prepend(err);
    result.classList.remove("hidden");

    setTimeout(() => {
        err.hidden = true;
    }, 3000);
}

async function handleCityInput(e) {
    const query = e.target.value.trim();

    if (query.length < 2) {
        clearCityDropdown();
        return;
    }

    const cities = await service.searchCities(query);
    renderCityDropdown(cities);
}

function clearCityDropdown() {
    if (!cityDropdown) return;
    cityDropdown.innerHTML = "";
}

function renderCityDropdown(cities) {
    clearCityDropdown();

    if (!cities || cities.length === 0) {
        return;
    }

    cities.forEach (city => {
        const li = document.createElement("li");
        li.textContent = `${city.name}, ${city.country} (${city.country_code})`;

        li.addEventListener("click", () => {
            cityInput.value = city.name;

            clearCityDropdown();

            showWeather();
        });
        
        cityDropdown.appendChild(li);
    });
}

window.addEventListener("DOMContentLoaded", showData);

setInterval(updateWeatherCards, 300000);

const toggleBtn = document.getElementById("toggleLayoutBtn");

toggleBtn.addEventListener("click", () => {
    result.classList.toggle("row-layout");
});