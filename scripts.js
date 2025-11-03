MOCK_WEATHER = {
"Stockholm": { tempC: 7, description: "Mulet", icon: "☁️ ", updated: "09:00" },
"Göteborg": { tempC: 8, description: "Lätt regn", icon: "🌧️", updated: "09:00" },
"Malmö": { tempC: 10, description: "Klart", icon: "☀️", updated: "09:00" },
"Uppsala": { tempC: 6, description: "Disigt", icon: "🌫️", updated: "09:00" },
"Lund": { tempC: 9, description: "Halvklart", icon: "⛅", updated: "09:00" }

};


// const searchBtn = document.getElementById("searchBtn");
// const cityInput = document.getElementById("cityInput");
// const result = document.getElementById("weatherResult");

// searchBtn.addEventListener("click", () => {
// const city = cityInput.value.trim();
// if (!MOCK_WEATHER[city]) {
// result.innerHTML = "<p>Staden finns inte i systemet.</p>";
// result.classList.remove("hidden");
// return;
// }
// const data = MOCK_WEATHER[city];
// result.innerHTML = `
// <h2>${city}</h2>
// <p>${data.icon} ${data.description}</p>
// <p>${data.tempC}°C</p>
// <small>Uppdaterad: ${data.updated}</small>
// `;
// result.classList.remove("hidden");
// });


const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const result = document.getElementById("weatherResult");

function showWeather(){
    const city = cityInput.value.trim().toLowerCase();

    const foundKey = Object.keys(MOCK_WEATHER).find((key) => key.toLowerCase() === city 
);

if (!foundKey) {
    result.innerHTML = "<p>Staden finns inte i systemet.</p>";
    result.classList.remove("hidden");
}

const data = MOCK_WEATHER [foundKey];
result.innerHTML = `
    <h2>${foundKey}</h2>
    <p>${data.icon} ${data.description}</p>
    <p>${data.tempC}°C</p>
    <small>Uppdaterad: ${data.updated}</small>
  `;
  result.classList.remove("hidden");

}

searchBtn.addEventListener("click", showWeather);

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        showWeather();
    }
});