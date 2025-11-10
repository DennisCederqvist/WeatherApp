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

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe/Stockholm&forecast_days=7`);
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        console.warn("Ingen väderdata hittades.");
        return null;
      }

      const { temperature, windspeed, weathercode, time } = weatherData.current_weather;

      console.log("Current Weather Data:", weatherData);
      return {
      name,
      temperature,
      windspeed,
      weathercode,
      time,
    };
  }

  catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}