import { saveData, showData, setManager } from './saveLocal.js';
import { WeatherService } from "./weatherByCity.js";
import { WeatherCardManager } from "./weatherCardManager.js";

const result = document.getElementById("weatherResult");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const manager = new WeatherCardManager(result);
setManager(manager);

const service = new WeatherService();

searchBtn.addEventListener("click", showWeather);

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        showWeather();
    }
});

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

window.addEventListener("DOMContentLoaded", showData);

// Uppdateras var 5:e minut
setInterval(updateWeatherCards, 300000);

const toggleBtn = document.getElementById("toggleLayoutBtn");

toggleBtn.addEventListener("click", () => {
    result.classList.toggle("row-layout");
});
