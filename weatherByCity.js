export async function getWeatherByCity(cityName) {
  try {
    const geoCor = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`);
    const geoData = await geoCor.json();

      const swedishResult = geoData.results.find(r => r.country_code === "SE");
      const { latitude, longitude } = swedishResult;
      console.log("Swedish Geocoding Result:", swedishResult);

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Stockholm`);
      const weatherData = await weatherRes.json();
      console.log("Current Weather Data:", weatherData);
      return swedishResult;
  }

  catch (error) {
    console.error("Error fetching weather data:", error);
  }
}