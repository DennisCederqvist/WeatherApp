import { WeatherCard } from "./weatherCard.js";
import { WeatherService } from "./weatherByCity.js";
import { saveData } from "./saveLocal.js"; 

export class WeatherCardManager {
  constructor(container) {
    this.container = container;
    this.cards = [];
    this.service = new WeatherService();
  }

  addCard(data) {
    const existing = this.cards.find(c => c.data.latitude === data.latitude && c.data.longitude === data.longitude);
    if (existing) {
      existing.element.remove();
      this.cards = this.cards.filter(c => c !== existing);
    }

    const card = new WeatherCard(data);

    const closeBtn = card.element.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
      this.removeCard(card);
    });

    this.cards.push(card);
    card.render(this.container);

    saveData();
  }

  removeCard(card) {
    card.element.remove();
    this.cards = this.cards.filter(c => c !== card);
    saveData();
  }

  async updateAll() {
    for (const card of this.cards) {
      const newData = await this.service.getWeatherByCity(card.data.name);
      if (newData) card.update(newData);
    }
    saveData();
  }
}