import { weatherCode } from "./weatherCode.js";

export class WeatherCard {
  constructor(data) {
    this.data = data;
    this.element = this.buildCard();
  }

    buildCard() {
    const card = document.createElement("div");
    card.classList.add("weathercard");
    card.setAttribute("data-city", this.data.name);
    card.setAttribute("data-weathercode", this.data.weathercode);


//bakgroundbild beroende på vädret
    const weather = weatherCode(this.data.weathercode);
    card.style.backgroundImage = `url(${weather.background})`;

    const region = document.createElement("div");
    region.classList.add("weather");

    region.setAttribute("role", "region");
    region.setAttribute("tabindex", "0");

    region.setAttribute("aria-labelledby", `title-${this.data.name}`);
    region.setAttribute("aria-describedby", `desc-${this.data.name}`);

    region.innerHTML = `
    <h2 id="title-${this.data.name}-${this.data.admin1}" aria-hidden="true">
        ${this.data.name}, ${this.data.admin1}
    </h2>
        <p aria-hidden="true">🌡️ ${this.data.temperature}°C</p>
        <p aria-hidden="true">${weather.description}</p>
        <p aria-hidden="true">💨 ${this.data.windspeed} m/s</p>

        <span id="desc-${this.data.name}" class="sr-only">
            ${this.data.temperature} grader, ${weather.description}, 
            vind ${this.data.windspeed} meter per sekund.
        </span>
    `;

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("close-btn");

    closeBtn.innerHTML = `<span aria-hidden="true">✖</span>`;
    closeBtn.setAttribute("aria-label", `Stäng kortet för ${this.data.name}`);


    card.appendChild(region);
    card.appendChild(closeBtn);

    return card;
    }

    render(parent) {
        parent.prepend(this.element);
    }

    update(newData) {
        this.data = newData;

        //ny text och bg
        const weather = weatherCode(newData.weathercode);

        const fields = this.element.querySelectorAll("p");
        fields[0].textContent = `🌡️ ${newData.temperature}°C`;
        fields[1].textContent = weather.description;
        fields[2].textContent = `💨 ${newData.windspeed} m/s`;

        //Uppdaterar bakgrundsbild
        this.element.style.backgroundImage = `url(${weather.background})`;
    }
}
