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


    // Rensa tidigare innehåll
    region.replaceChildren();

    const safeKey = String(this.data.name ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-");

        const h2 = document.createElement("h2");
        h2.id = `title-${safeKey}`;
        h2.textContent = this.data.name ?? "";
        region.appendChild(h2);

        if (this.data.admin1) {
        const h3 = document.createElement("h3");
        h3.textContent = this.data.admin1;
        region.appendChild(h3);
        }

        const pTemp = document.createElement("p");
        pTemp.setAttribute("aria-hidden", "true");
        pTemp.textContent = `🌡️ ${this.data.temperature}°C`;
        region.appendChild(pTemp);

        const pDesc = document.createElement("p");
        pDesc.setAttribute("aria-hidden", "true");
        pDesc.textContent = weather.description ?? "";
        region.appendChild(pDesc);

        const pWind = document.createElement("p");
        pWind.setAttribute("aria-hidden", "true");
        pWind.textContent = `💨 ${this.data.windspeed} m/s`;
        region.appendChild(pWind);

        const sr = document.createElement("span");
        sr.id = `desc-${safeKey}`;
        sr.className = "sr-only";
        sr.textContent = `${this.data.temperature} grader, ${weather.description ?? ""}, vind ${this.data.windspeed} meter per sekund.`;
        region.appendChild(sr);


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
