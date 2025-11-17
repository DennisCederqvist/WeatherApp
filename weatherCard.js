import { weatherCode } from "./weatherCode.js";
import { saveData } from "./saveLocal.js";

//Klassen skapar kortet som visar vädret.
export class WeatherCard {
  constructor(data) {
    this.data = data;
    this.element = this.buildCard();
  }
//kortet struktureras och skriv ut i webläsaren
  buildCard() {
    const card = document.createElement("div");
    card.classList.add("weathercard");
    card.setAttribute("data-city", this.data.name);

    const region = document.createElement("div");
    region.classList.add("weather");
    region.innerHTML = `
      <h2>${this.data.name}</h2>
      <p>🌡️ ${this.data.temperature}°C</p>
      <p>${weatherCode(this.data.weathercode)}</p>
      <p>💨 ${this.data.windspeed} m/s</p>
    `;

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = "✖";

    closeBtn.addEventListener("click", () => {
      card.remove();
      if (typeof saveData === "function") saveData();
    });

    card.appendChild(region);
    card.appendChild(closeBtn);

    return card;
  }

  render(parent) {
    parent.prepend(this.element);
  }

  update(newData) {
    this.data = newData;

    const fields = this.element.querySelectorAll("p");
    fields[0].textContent = `🌡️ ${newData.temperature}°C`;
    fields[1].textContent = weatherCode(newData.weathercode);
    fields[2].textContent = `💨 ${newData.windspeed} m/s`;
  }
}
