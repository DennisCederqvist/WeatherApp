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
let selectedCity = null;

searchBtn.addEventListener("click", showWeather);

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        showWeather();
    }
});

cityInput.addEventListener("input", handleCityInput);

// async function showWeather() {
//     const city = cityInput.value.trim().toLowerCase();
//     const data = await service.getWeatherByCity(city);

//     if (!data) {
//         showError("⚠️ Staden finns inte i systemet");
//         return;
//     }

//     manager.addCard(data);
//     saveData();  

//     cityInput.value = "";
// }

async function showWeather() {
  const inputValue = cityInput.value.trim();
  if (!inputValue) return;

  let weather;

  if (selectedCity) {
    weather = await service.getWeatherByLocation(selectedCity);
  } else {
    weather = await service.getWeatherByCity(inputValue);
  }

  if (!weather) {
    showError("Staden hittades inte.");
    return;
  }

  manager.addCard(weather);
  saveData();

  selectedCity = null;
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

    selectedCity = null;

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

  cities.forEach(city => {
    const li = document.createElement("li");

    const label = city.admin1
      ? `${city.name}, ${city.admin1}, ${city.country} (${city.country_code})`
      : `${city.name}, ${city.country} (${city.country_code})`;

    li.textContent = label;

li.addEventListener("click", async () => {
  cityInput.value = label;
  clearCityDropdown();

  try {
    // Hämta väder direkt för den här exakta platsen
    const weather = await service.getWeatherByLocation
      ? await service.getWeatherByLocation(city)  // om du har lagt till den metoden
      : await service.getWeatherByCity(city.name); // fallback om du INTE gjort det än

    if (!weather) {
      showError("Staden hittades inte.");
      return;
    }

    manager.addCard(weather);
    saveData();
  } catch (err) {
    console.error(err);
    showError("Något gick fel när vädret skulle hämtas.");
  }
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