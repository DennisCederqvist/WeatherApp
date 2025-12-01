// samma stad i olika länder kan ej visas samtidigt.
// flytta admin1 och countrykod till ny rad med mindre font


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

cityInput.addEventListener("keydown", async (e) => {
  if (e.key === "ArrowDown") {
    const firstItem = cityDropdown.querySelector("li");
    if (firstItem) {
      e.preventDefault();
      firstItem.focus(); // flytta fokus till första raden
    }
  } else if (e.key === "Enter") {
    e.preventDefault();
    // Ingen rad vald i dropdown → kör vanlig sökning
    await showWeather();
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

    cityInput.value = "";
    selectedCity = null;
    clearCityDropdown();
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
  renderCityDropdown(cities || []);
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

  cities.forEach((city) => {
    const li = document.createElement("li");

    const label = city.admin1
      ? `${city.name}, ${city.admin1}, ${city.country} (${city.country_code})`
      : `${city.name}, ${city.country} (${city.country_code})`;

    li.textContent = label;

    // gör den fokuserbar med tangentbord
    li.tabIndex = -1;

    // spara city på elementet så dropdownen själv vet vad den representerar
    li._city = city;

    li.addEventListener("click", async () => {
      await handleCitySelection(city);
    });

    cityDropdown.appendChild(li);
  });
}


async function handleCitySelection(city) {
  if (!city) return;

  const label = city.admin1
    ? `${city.name}, ${city.admin1}, ${city.country} (${city.country_code})`
    : `${city.name}, ${city.country} (${city.country_code})`;

  // visa den valda staden i fältet en kort stund (mest kosmetik)
  cityInput.value = label;

  try {
    const weather = await (service.getWeatherByLocation
      ? service.getWeatherByLocation(city)
      : service.getWeatherByCity(city.name)
    );

    if (!weather) {
      showError("Staden hittades inte.");
      return;
    }

    manager.addCard(weather);
    saveData();

    cityInput.value = "";
    clearCityDropdown();

  } catch (err) {
    console.error(err);
    showError("Något gick fel när vädret skulle hämtas.");
  }
}

cityDropdown.addEventListener("keydown", async (e) => {
  const current = document.activeElement;

  // bara om fokus faktiskt är på ett <li> i dropdownen
  if (!current || current.parentElement !== cityDropdown) {
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = current.nextElementSibling || cityDropdown.firstElementChild;
    if (next) {
      next.focus();
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    const prev = current.previousElementSibling || cityDropdown.lastElementChild;
    if (prev) {
      prev.focus();
    }
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (current._city) {
      await handleCitySelection(current._city);
    }
  } else if (e.key === "Escape") {
    e.preventDefault();
    clearCityDropdown();
    cityInput.focus();
  }
});


window.addEventListener("DOMContentLoaded", showData);

setInterval(updateWeatherCards, 300000);

const toggleBtn = document.getElementById("toggleLayoutBtn");

toggleBtn.addEventListener("click", () => {
    result.classList.toggle("row-layout");
});