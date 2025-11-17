import { weatherCode } from './weatherCode.js';
import { saveData, showData } from './saveLocal.js';
import { WeatherCard } from "./weatherCard.js";
import { WeatherService } from "./weatherByCity.js";

const service = new WeatherService();

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const result = document.getElementById("weatherResult");

searchBtn.addEventListener("click", showWeather);

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        showWeather();
    }
});

async function updateWeatherCards() {
  const cards = document.querySelectorAll(".weathercard");

  for (const cardElement of cards) {
    const city = cardElement.getAttribute("data-city");
    const data = await service.getWeatherByCity(city);

    if (!data) continue;

    // Uppdatera DOM-elementen direkt
    const fields = cardElement.querySelectorAll("p");
    fields[0].textContent = `🌡️ ${data.temperature}°C`;
    fields[1].textContent = weatherCode(data.weathercode);
    fields[2].textContent = `💨 ${data.windspeed} m/s`;

    let small = cardElement.querySelector("small");
    if (!small) {
      small = document.createElement("small");
      cardElement.appendChild(small);
    }
    small.textContent = `Uppdaterad: ${new Date(data.time).toLocaleTimeString("sv-SE")}`;
  }
}

async function showWeather() {
    const city = cityInput.value.trim().toLowerCase();
    const data = await service.getWeatherByCity(city);

    if (!data) {
      showError("⚠️ Staden finns inte i systemet.");
    return;
    }

    // Ta bort gammalt kort om staden redan finns
    const existingCard = result.querySelector(`[data-city="${data.name}"]`);
    if (existingCard) existingCard.remove();

    // Skapa kort via klassen
    const card = new WeatherCard(data);
    card.render(result);

    saveData();
    cityInput.value = "";
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

//visar sparad data från lokal när sidan laddas
window.addEventListener("DOMContentLoaded", showData);
//Uppdateras var 5:e minut
setInterval(updateWeatherCards, 300000);

