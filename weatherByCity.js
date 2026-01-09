
const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const WX_BASE = "https://api.open-meteo.com/v1/forecast";

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

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text.slice(0, 200)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON: ${text.slice(0, 200)}`);
  }
}

function windDirectionName(deg) {
  // 16-vägs kompass (N, NNE, NE, ...)
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  if (typeof deg !== "number" || Number.isNaN(deg)) return "";
  const idx = Math.round(((deg % 360) / 22.5)) % 16;
  return dirs[idx];
}

async function geocodeCity(name) {
  const url = `${GEO_BASE}?name=${encodeURIComponent(name)}&count=10&language=sv&format=json`;
  const json = await fetchJson(url);
  return Array.isArray(json?.results) ? json.results : [];
}

async function getCurrentWeather(lat, lon) {
  const url = `${WX_BASE}?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current_weather=true&timezone=auto`;
  const json = await fetchJson(url);
  return json?.current_weather ?? null;
}

function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tar bort accenter (Malmö -> malmo)
    .trim();
}

function tokenizeFilter(filterText) {
  const t = norm(filterText);
  if (!t) return [];

  // stöd både "london england" och "london, england"
  // kommatecken och flera mellanslag blir separators
  const rawTokens = t.split(/[\s,]+/).filter(Boolean);

  // enkla alias (heuristik) för vanliga söktermer
  const alias = new Map([
    ["uk", "united kingdom"],
    ["storbritannien", "united kingdom"],
    ["gb", "gb"],

    ["usa", "united states"],
    ["us", "us"],
    ["unitedstates", "united states"],
  ]);

  return rawTokens.map(tok => alias.get(tok) ?? tok);
}

function matchesAllTokens(result, tokens) {
  if (!tokens.length) return true;

  const hay = norm(
    `${result.name} ${result.admin1 ?? ""} ${result.country ?? ""} ${result.country_code ?? ""}`
  );

  return tokens.every(tok => hay.includes(tok));
}

export async function searchCities(query) {
  const q = String(query ?? "").trim();
  if (q.length < 2) return [];

  // 1) Dela upp input i "stad" + "filter"
  //    - Om det finns komma: "London, Ohio" => city="London", filter="Ohio"
  //    - Annars: "London Ohio" => city="London", filter="Ohio"
  let cityPart = q;
  let filterPart = "";

  if (q.includes(",")) {
    const parts = q.split(",").map(p => p.trim()).filter(Boolean);
    cityPart = parts[0] ?? q;
    filterPart = parts.slice(1).join(" ");
  } else {
    const parts = q.split(/\s+/).filter(Boolean);
    cityPart = parts[0] ?? q;
    filterPart = parts.slice(1).join(" ");
  }

  const tokens = tokenizeFilter(filterPart);

  try {
    // 2) Sök alltid geocoding på bara stadsnamnet
    const results = await geocodeCity(cityPart);

    // 3) Filtrera lokalt på admin1/country/country_code
    const filtered = results.filter(r => matchesAllTokens(r, tokens));

    // 4) Returnera filtrerade om de finns, annars fallback till alla
    const finalResults = (filtered.length ? filtered : results).slice(0, 10);

    return finalResults.map(r => ({
      name: r.name,
      country: r.country,
      country_code: r.country_code,
      admin1: r.admin1 ?? "",
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  } catch (err) {
    console.error("City search failed:", err);
    return [];
  }
}


export async function getWeatherByLocation(location) {
  try {
    const { name, latitude, longitude, country, country_code, admin1 } = location;

    const cw = await getCurrentWeather(latitude, longitude);
    if (!cw) return null;

    return {
      name,
      country,
      country_code,
      admin1: admin1 ?? "",
      latitude,
      longitude,
      temperature: cw.temperature,
      windspeed: cw.windspeed,
      wind_dir: windDirectionName(cw.winddirection),
      weathercode: cw.weathercode,
      updated_at: cw.time,
      is_day: cw.is_day,
    };
  } catch (err) {
    console.error("Weather by location failed:", err);
    return null;
  }
}

export async function getWeatherByCity(cityName) {
  try {
    if (!cityName) return null;

    let city = cityName;
    let region = null;

    if (cityName.includes(",")) {
      const parts = cityName.split(",").map(p => p.trim()).filter(Boolean);
      city = parts[0] ?? cityName;
      region = parts[1] ?? null;
    }

    const results = await geocodeCity(city);

    if (!results.length) return null;

    // Om region angiven: försök matcha admin1
    let picked = results[0];
    if (region) {
      const regionLower = region.toLowerCase();
      const match = results.find(r => (r.admin1 ?? "").toLowerCase() === regionLower);
      if (match) picked = match;
    }

    const cw = await getCurrentWeather(picked.latitude, picked.longitude);
    if (!cw) return null;

    return {
      name: picked.name,
      country: picked.country,
      country_code: picked.country_code,
      admin1: picked.admin1 ?? "",
      latitude: picked.latitude,
      longitude: picked.longitude,
      temperature: cw.temperature,
      windspeed: cw.windspeed,
      wind_dir: windDirectionName(cw.winddirection),
      weathercode: cw.weathercode,
      updated_at: cw.time,
      is_day: cw.is_day,
    };
  } catch (err) {
    console.error("Weather by city failed:", err);
    return null;
  }
}


// Nedan, stockholm3 API (fungerar halvdant)


// export class WeatherService {
//   async searchCities(query) {
//     return await searchCities(query);
//   }

//   async getWeatherByCity(cityName) {
//     return await getWeatherByCity(cityName);
//   }

//   async getWeatherByLocation(location) {
//   return await getWeatherByLocation(location);
//   }

// }

// export async function searchCities(query) {
//   if (!query || query.length < 2) return [];

//   try {
//     // autocomplete api
//     const res = await fetch(
//       `http://stockholm3.onvo.se/v1/cities?query=${encodeURIComponent(query)}`
//     );
//     const json = await res.json();

//     let cities = json.success ? json.data.cities : [];

    
//     const exactMatch = cities.some(
//       c => c.name.toLowerCase() === query.toLowerCase()
//     );

//     // fixar om det inte finns en exakt match från autocomplete apiet ovan, annars får vi fel resultat för vissa städer. 
//     // (fallback till vanlig sök)
//     if (cities.length === 1 && !exactMatch) {
//       const weatherRes = await fetch(
//         `http://stockholm3.onvo.se/v1/weather?city=${encodeURIComponent(query)}`
//       );
//       const weatherJson = await weatherRes.json();

//       if (weatherJson.success) {
//         const loc = weatherJson.data.location;
//         cities = [loc];
//       }
//     }

//     return cities.map(c => ({
//       name: c.name,
//       country: c.country,
//       country_code: c.country_code,
//       admin1: c.region ?? "",
//       latitude: c.latitude,
//       longitude: c.longitude,
//     }));

//   } catch (err) {
//     console.error("City search failed:", err);
//     return [];
//   }
// }




// // weather by loction

// export async function getWeatherByLocation(location) {
//   try {
//     const { name, latitude, longitude, country, country_code, admin1 } = location;

//     const res = await fetch(
//       `http://stockholm3.onvo.se/v1/current?lat=${latitude}&lon=${longitude}`
//     );

//     const json = await res.json();
//     if (!json.success) return null;

//     const cw = json.data.current_weather;

//     return {
//       name,
//       country,
//       country_code,
//       admin1,
//       latitude,
//       longitude,
//       temperature: cw.temperature,
//       windspeed: cw.windspeed,
//       wind_dir: cw.wind_direction_name,
//       weathercode: cw.weather_code,
//       updated_at: cw.time,
//       is_day: cw.is_day,
//     };
//   } catch (err) {
//     console.error("Weather by location failed:", err);
//     return null;
//   }
// }


// // Weather by city

// export async function getWeatherByCity(cityName) {
//   try {
//     let city = cityName;
//     let region = null;

//     if (cityName.includes(",")) {
//       const parts = cityName.split(",").map(p => p.trim());
//       city = parts[0];
//       region = parts[1];
//     }

//     let url = `http://stockholm3.onvo.se/v1/weather?city=${encodeURIComponent(city)}`;
//     if (region) url += `&region=${encodeURIComponent(region)}`;

//     const res = await fetch(url);
//     const json = await res.json();
//     if (!json.success) return null;

//     const { location, current_weather } = json.data;

//     return {
//       name: location.name,
//       country: location.country,
//       country_code: location.country_code,
//       admin1: location.region ?? "",
//       latitude: location.latitude,
//       longitude: location.longitude,
//       temperature: current_weather.temperature,
//       windspeed: current_weather.windspeed,
//       wind_dir: current_weather.wind_direction_name,
//       weathercode: current_weather.weather_code,
//       updated_at: current_weather.time,
//       is_day: current_weather.is_day,
//     };
//   } catch (err) {
//     console.error("Weather by city failed:", err);
//     return null;
//   }
// }


