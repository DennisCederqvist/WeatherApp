// Spara varje kort som object.
export function saveData() {
  const cards = document.querySelectorAll(".weathercard");
  const data = [];

  cards.forEach(card => {
    const city = card.getAttribute("data-city");
    const temp = card.querySelector("p:nth-of-type(1)").textContent.replace("🌡️ ", "").replace("°C", "");
    const desc = card.querySelector("p:nth-of-type(2)").textContent;
    const wind = card.querySelector("p:nth-of-type(3)").textContent.replace("💨 ", "").replace(" m/s", "");

    data.push({ city, temperature: temp, description: desc, windspeed: wind });
  });

  localStorage.setItem("weatherCards", JSON.stringify(data));
}


//läser in skapade kort igen
export function showData() {
  const saved = localStorage.getItem("weatherCards");
  if (!saved) return;

  const cards = JSON.parse(saved);
  cards.forEach(data => {
    const card = document.createElement("div");
    card.classList.add("weathercard");
    card.setAttribute("data-city", data.city);
    card.innerHTML = `
      <div class="weather">
        <button class="close-btn" title="Stäng">✖</button>
        <h2>${data.city}</h2>
        <p>🌡️ ${data.temperature}°C</p>
        <p>${data.description}</p>
        <p>💨 ${data.windspeed} m/s</p>
      </div>
    `;
    weatherResult.prepend(card);


    // gör så att "stäng"-knappen fungerar även för sparade kort
    const closeBtn = card.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
      card.remove();
      saveData(); // sparar ändringen
    });
  });
}

//visar sparad data från lokal när sidan laddas
window.addEventListener("DOMContentLoaded", showData);