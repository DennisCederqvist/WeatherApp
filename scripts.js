import { getWeatherByCity } from './weatherByCity.js';

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const result = document.getElementById("weatherResult");

async function showWeather(){
    const city = cityInput.value.trim().toLowerCase();
    const data = await getWeatherByCity(city);
      if (!data) {
        let err = document.getElementById("weatherError");
      if (!err) {
        err = document.createElement("p");
        err.id = "weatherError";
        err.className = "error";
        result.prepend(err);
    }
    err.textContent = "⚠️ Staden finns inte i systemet.";
    err.style.color = "red";
    err.hidden = false;
    result.classList.remove("hidden");
    cityInput.value = "";
    return;
    }

  const existingCard = result.querySelector(`[data-city="${city}"]`);
    if (existingCard) {
      existingCard.remove();
    }

  const card = document.createElement("div");
  card.classList.add("weathercard");
  card.setAttribute("data-city", data.name);
  card.innerHTML = `
    <div class="weather">
      <button class="close-btn" title="Stäng">✖</button>
      <h2>${data.name}</h2>
      <p>🌡️ ${data.temperature}°C</p>
      <p>💨 ${data.windspeed} m/s</p>
      <small>Uppdaterad: ${new Date(data.time).toLocaleTimeString("sv-SE")}</small>
    </div>
  `;
  result.prepend(card);

  const closeBtn = card.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    card.style.opacity = "0";
    setTimeout(() => card.remove(), 300);
  });

    result.classList.remove("hidden");
    cityInput.value = "";
}


searchBtn.addEventListener("click", showWeather);

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        showWeather();
    }
});



async function updateWeatherCards() {
  const cards = document.querySelectorAll(".weathercard");

  for (const card of cards) {
    const city = card.getAttribute("data-city");
    const data = await getWeatherByCity(city);
    if (!data) continue;

    card.querySelector("p:nth-of-type(1)").textContent = `🌡️ ${data.temperature}°C`;
    card.querySelector("p:nth-of-type(2)").textContent = `💨 ${data.windspeed} m/s`;
    card.querySelector("small").textContent = `Uppdaterad: ${new Date(data.time).toLocaleTimeString("sv-SE")}`;
  }
}

// Uppdateras var 5:e minut
setInterval(updateWeatherCards, 300000);