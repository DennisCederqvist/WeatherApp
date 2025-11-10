MOCK_WEATHER = {
"Stockholm": { tempC: 7, description: "Mulet", icon: "☁️ ", updated: "09:00" },
"Göteborg": { tempC: 8, description: "Lätt regn", icon: "🌧️", updated: "09:00" },
"Malmö": { tempC: 10, description: "Klart", icon: "☀️", updated: "09:00" },
"Uppsala": { tempC: 6, description: "Disigt", icon: "🌫️", updated: "09:00" },
"Lund": { tempC: 9, description: "Halvklart", icon: "⛅", updated: "09:00" }
};

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const result = document.getElementById("weatherResult");

function showWeather(){
    const city = cityInput.value.trim().toLowerCase();
    getWeatherByCity(city);
    const foundKey = Object.keys(MOCK_WEATHER).find((key) => key.toLowerCase() === city 
);

if (!foundKey) {
    let err = document.getElementById("weatherError");
    if (!err) {
      err = document.createElement("p");
      err.id = "weatherError";
      err.className = "error";
      result.prepend(err);
    }
    err.textContent = "⚠️ Staden finns inte i systemet.";
    err.style.color ="red";
    err.hidden = false;
    result.classList.remove("hidden");
    cityInput.value = "";
    return;
  }

const existingErr = document.getElementById("weatherError");
    if (existingErr) existingErr.hidden = true;

const existingCard = result.querySelector(`[data-city="${foundKey}"]`);
  if (existingCard) {
    existingCard.remove();
  }

const data = MOCK_WEATHER [foundKey];
const card = document.createElement("div");
card.classList.add("weathercard");
card.setAttribute("data-city", foundKey);
card.innerHTML = `
    <div class="weather">
    <button class="close-btn" title="Stäng">✖</button>
        <h2>${foundKey}</h2>
        <p>${data.icon} ${data.description}</p>
        <p class="temp">${data.tempC}°C</p>
        <small class="updated">Uppdaterad: ${data.updated} </small> 
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


function updateWeatherCards() {
  const cards = document.querySelectorAll(".weathercard");
  cards.forEach((card) => {
    const city = card.getAttribute("data-city");
    const data = MOCK_WEATHER[city];
    if (!data) return;

    card.querySelector("p:nth-of-type(1)").innerHTML = `${data.icon} ${data.description}`;
    card.querySelector("p:nth-of-type(2)").textContent = `${data.tempC}°C`;
    card.querySelector("small").textContent = `Uppdaterad: ${data.updated}`;
  });
}

setInterval(updateWeatherCards, 10000);

async function getWeatherByCity(cityName) {
  try {
    const geoCor = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`);
    const geoData = await geoCor.json();

      const swedishResult = geoData.results.find(r => r.country_code === "SE");
      const { latitude, longitude } = swedishResult;
      console.log("Swedish Geocoding Result:", swedishResult);

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Stockholm`);
      const weatherData = await weatherRes.json();
      console.log("Current Weather Data:", weatherData);
      return swedishResult;
  }

  catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
