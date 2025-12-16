export class WeatherService {
  async searchCities(query) {
    return await searchCities(query);
  }

  async getWeatherByCity(cityName) {
    return await getWeatherByCity(cityName);
  }

  async getWeatherByLocation(location) {
  return await getWeatherByLocation(location);
  }

}

export async function searchCities(query) {
  if (!query || query.length < 2) return [];

  try {
    // autocomplete api
    const res = await fetch(
      `http://stockholm3.onvo.se/v1/cities?query=${encodeURIComponent(query)}`
    );
    const json = await res.json();

    let cities = json.success ? json.data.cities : [];

    
    const exactMatch = cities.some(
      c => c.name.toLowerCase() === query.toLowerCase()
    );

    // fixar om det inte finns en exakt match från autocomplete apiet ovan, annars får vi fel resultat för vissa städer. 
    // (fallback till vanlig sök)
    if (cities.length === 1 && !exactMatch) {
      const weatherRes = await fetch(
        `http://stockholm3.onvo.se/v1/weather?city=${encodeURIComponent(query)}`
      );
      const weatherJson = await weatherRes.json();

      if (weatherJson.success) {
        const loc = weatherJson.data.location;
        cities = [loc];
      }
    }

    return cities.map(c => ({
      name: c.name,
      country: c.country,
      country_code: c.country_code,
      admin1: c.region ?? "",
      latitude: c.latitude,
      longitude: c.longitude,
    }));

  } catch (err) {
    console.error("City search failed:", err);
    return [];
  }
}




// weather by loction

export async function getWeatherByLocation(location) {
  try {
    const { name, latitude, longitude, country, country_code, admin1 } = location;

    const res = await fetch(
      `http://stockholm3.onvo.se/v1/current?lat=${latitude}&lon=${longitude}`
    );

    const json = await res.json();
    if (!json.success) return null;

    const cw = json.data.current_weather;

    return {
      name,
      country,
      country_code,
      admin1,
      latitude,
      longitude,
      temperature: cw.temperature,
      windspeed: cw.windspeed,
      wind_dir: cw.wind_direction_name,
      weathercode: cw.weather_code,
      updated_at: cw.time,
      is_day: cw.is_day,
    };
  } catch (err) {
    console.error("Weather by location failed:", err);
    return null;
  }
}


// Weather by city

export async function getWeatherByCity(cityName) {
  try {
    let city = cityName;
    let region = null;

    if (cityName.includes(",")) {
      const parts = cityName.split(",").map(p => p.trim());
      city = parts[0];
      region = parts[1];
    }

    let url = `http://stockholm3.onvo.se/v1/weather?city=${encodeURIComponent(city)}`;
    if (region) url += `&region=${encodeURIComponent(region)}`;

    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) return null;

    const { location, current_weather } = json.data;

    return {
      name: location.name,
      country: location.country,
      country_code: location.country_code,
      admin1: location.region ?? "",
      latitude: location.latitude,
      longitude: location.longitude,
      temperature: current_weather.temperature,
      windspeed: current_weather.windspeed,
      wind_dir: current_weather.wind_direction_name,
      weathercode: current_weather.weather_code,
      updated_at: current_weather.time,
      is_day: current_weather.is_day,
    };
  } catch (err) {
    console.error("Weather by city failed:", err);
    return null;
  }
}
