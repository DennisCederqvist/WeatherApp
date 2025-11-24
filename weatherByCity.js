export class WeatherService {
  async getWeatherByCity(city) {
    return await getWeatherByCity(city); // använder din befintliga funktion
  }
}

export async function getWeatherByCity(cityName) {
  try {
    const geoCor = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`);
    const geoData = await geoCor.json();

      const swedishResult = geoData.results.find(r => r.country_code === "SE");
          if (!swedishResult) {
            console.warn(`Ingen svensk stad med namnet '${cityName}' hittades.`);
            return null;
          }
      const { name, latitude, longitude } = swedishResult;
      console.log("Swedish Geocoding Result:", swedishResult);

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

      const weather = {
      name,
      temperature: weatherData.current.temperature_c,
      windspeed: weatherData.current.wind_mps,
      wind_deg: weatherData.current.wind_deg,
      elevation: weatherData.current.elevation_m,
      weathercode: weatherData.current.weather_code,
      updated_at: weatherData.updated_at,
    };

    console.log("Current Weather Data:", weather);
    return weather;
  } 

  catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}