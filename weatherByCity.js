// export class WeatherService {
//   async getWeatherByCity(city) {
//     return await getWeatherByCity(city); // använder din befintliga funktion
//   }
// }

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
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const res = await fetch (
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
    );

    const data = await res.json();

    if (!data.results) {
      return [];
    }

      return data.results.map(r => ({
      name: r.name,
      country: r.country,
      country_code: r.country_code,
      admin1: r.admin1,
      latitude: r.latitude,
      longitude: r.longitude,
    }));

  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }

}

// weather by loction

export async function getWeatherByLocation(location) {
  try {
    const { name, latitude, longitude, country, country_code, admin1 } = location;

    const weatherRes = await fetch(
      `http://stockholm3.onvo.se:81/v1/current?lat=${latitude}&lon=${longitude}`
    );

    if (!weatherRes.ok) {
      console.warn("Väder-API svarade med fel.");
      return null;
    }

    const weatherData = await weatherRes.json();

    if (!weatherData.current) {
      console.warn("Ingen väderdata hittades.");
      return null;
    }

    let rawWind = weatherData.current.windspeed / 3.6;
    rawWind = Number(rawWind.toFixed(1));

    const weather = {
      name,
      country,
      country_code,
      admin1,
      latitude,
      longitude,
      temperature: weatherData.current.temperature,
      windspeed: rawWind,
      wind_dir: weatherData.current.wind_direction_name,
      weathercode: weatherData.current.weather_code,
      updated_at: weatherData.current.time,
      is_day: weatherData.current.is_day,
    };

    console.log("Current Weather Data (by location):", weather);
    return weather;
  } catch (error) {
    console.error("Error fetching weather data by location:", error);
    return null;
  }
}

// Weather by city

export async function getWeatherByCity(cityName) {
  try {
    // const geoCor = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`);
    // const geoData = await geoCor.json();

    //   const swedishResult = geoData.results.find(r => r.country_code === "SE");
    //       if (!swedishResult) {
    //         console.warn(`Ingen svensk stad med namnet '${cityName}' hittades.`);
    //         return null;
    //       }
    //   const { name, latitude, longitude } = swedishResult;
    //   console.log("Swedish Geocoding Result:", swedishResult);

    const geoCore = await fetch (
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`
    );

    const geoData = await geoCore.json();
    const result = geoData.results?.[0];

    if (!result) {
      console.warn(`Ingen stad med namnet '${cityName}' hittades.`);
      return null;
    }

    const { name, latitude, longitude, country, country_code, admin1 } = result;
    console.log("Geocoding Result:", result);

    const weatherRes = await fetch(`http://stockholm3.onvo.se:81/v1/current?lat=${latitude}&lon=${longitude}`);

    if (!weatherRes.ok) {
    console.warn("Väder-API svarade med fel.");
    return null;
    }

    const weatherData = await weatherRes.json();

    if (!weatherData.current) {
      console.warn("Ingen väderdata hittades.");
      return null;
    }

    let rawWind = weatherData.current.windspeed / 3.6;
    rawWind = Number(rawWind.toFixed(1));

    const weather = {
    name,
    country,
    country_code,
    admin1,
    latitude,
    longitude,
    temperature: weatherData.current.temperature,
    windspeed: rawWind,
    wind_dir: weatherData.current.wind_direction_name,
    weathercode: weatherData.current.weather_code,
    updated_at: weatherData.current.time,
    is_day: weatherData.current.is_day,
  };

    console.log("Current Weather Data:", weather);
    return weather;
  } 

  catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}