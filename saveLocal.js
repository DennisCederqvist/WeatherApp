let manager = null;

export function setManager(m) {
  manager = m;
}

export function saveData() {
  if (!manager) return;

  const data = manager.cards.map(card => ({
    city: card.data.name,
    temperature: card.data.temperature,
    windspeed: card.data.windspeed,
    weathercode: card.data.weathercode 
  }));

  localStorage.setItem("weatherCards", JSON.stringify(data));
}

export function showData() {
  const saved = localStorage.getItem("weatherCards");
  if (!saved || !manager) return;

  const cards = JSON.parse(saved);

  cards.forEach(data => {
    manager.addCard({
      name: data.city,
      temperature: Number(data.temperature),
      windspeed: Number(data.windspeed),
      weathercode: Number(data.weathercode) 
    });
  });
}