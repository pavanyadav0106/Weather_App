// api/weather.js
// Vercel Serverless Function — replaces the entire backend/
// Vercel automatically exposes this at /api/weather (and sub-paths via rewrites)

const axios = require("axios");

const OWM_BASE = "https://api.openweathermap.org/data/2.5";

function getApiKey() {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error("OPENWEATHER_API_KEY not set in Vercel environment variables.");
  return key;
}

function handleAxiosError(err, res) {
  if (err.response) {
    const status = err.response.status;
    if (status === 404) return res.status(404).json({ error: "City not found. Check the spelling and try again." });
    if (status === 401) return res.status(401).json({ error: "Invalid API key." });
    return res.status(status).json({ error: err.response.data?.message || "API error" });
  }
  return res.status(500).json({ error: "Failed to reach weather service." });
}

function transformCurrent(data) {
  return {
    city:        data.name,
    country:     data.sys.country,
    lat:         data.coord.lat,
    lon:         data.coord.lon,
    temperature: Math.round(data.main.temp),
    feelsLike:   Math.round(data.main.feels_like),
    tempMin:     Math.round(data.main.temp_min),
    tempMax:     Math.round(data.main.temp_max),
    humidity:    data.main.humidity,
    pressure:    data.main.pressure,
    visibility:  Math.round((data.visibility || 0) / 1000),
    windSpeed:   data.wind.speed,
    windDeg:     data.wind.deg,
    description: data.weather[0].description,
    icon:        data.weather[0].icon,
    iconUrl:     `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    sunrise:     data.sys.sunrise,
    sunset:      data.sys.sunset,
    timezone:    data.timezone,
    dt:          data.dt,
  };
}

function transformForecast(data) {
  const byDay = {};
  data.list.forEach((item) => {
    const day = item.dt_txt.split(" ")[0];
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push({
      dt:          item.dt,
      time:        item.dt_txt,
      temperature: Math.round(item.main.temp),
      feelsLike:   Math.round(item.main.feels_like),
      tempMin:     Math.round(item.main.temp_min),
      tempMax:     Math.round(item.main.temp_max),
      humidity:    item.main.humidity,
      windSpeed:   item.wind.speed,
      description: item.weather[0].description,
      icon:        item.weather[0].icon,
      iconUrl:     `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      pop:         Math.round((item.pop || 0) * 100),
    });
  });
  const days = Object.entries(byDay).map(([date, slots]) => {
    const temps   = slots.map((s) => s.temperature);
    const midSlot = slots[Math.floor(slots.length / 2)];
    return {
      date,
      tempMin:     Math.min(...temps),
      tempMax:     Math.max(...temps),
      description: midSlot.description,
      icon:        midSlot.icon,
      iconUrl:     midSlot.iconUrl,
      humidity:    midSlot.humidity,
      windSpeed:   midSlot.windSpeed,
      pop:         Math.max(...slots.map((s) => s.pop)),
      hourly:      slots,
    };
  });
  return { city: data.city.name, country: data.city.country, days: days.slice(0, 5) };
}

// ── Main handler — Vercel calls this for every request to /api/weather/*
module.exports = async (req, res) => {
  // CORS headers — allow your Vercel frontend domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { pathname } = new URL(req.url, `https://${req.headers.host}`);
  const apiKey = getApiKey();

  try {
    // GET /api/weather/current?city=London
    if (pathname.endsWith("/current")) {
      const { city } = req.query;
      if (!city) return res.status(400).json({ error: "city param required" });
      const { data } = await axios.get(`${OWM_BASE}/weather`, {
        params: { q: city, appid: apiKey, units: "metric" }, timeout: 8000,
      });
      return res.json(transformCurrent(data));
    }

    // GET /api/weather/forecast?city=London
    if (pathname.endsWith("/forecast")) {
      const { city } = req.query;
      if (!city) return res.status(400).json({ error: "city param required" });
      const { data } = await axios.get(`${OWM_BASE}/forecast`, {
        params: { q: city, appid: apiKey, units: "metric", cnt: 40 }, timeout: 8000,
      });
      return res.json(transformForecast(data));
    }

    // GET /api/weather/location?lat=&lon=
    if (pathname.endsWith("/location")) {
      const { lat, lon } = req.query;
      if (!lat || !lon) return res.status(400).json({ error: "lat and lon required" });
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`${OWM_BASE}/weather`,  { params: { lat, lon, appid: apiKey, units: "metric" }, timeout: 8000 }),
        axios.get(`${OWM_BASE}/forecast`, { params: { lat, lon, appid: apiKey, units: "metric", cnt: 40 }, timeout: 8000 }),
      ]);
      return res.json({ current: transformCurrent(currentRes.data), forecast: transformForecast(forecastRes.data) });
    }

    return res.status(404).json({ error: "Unknown endpoint" });

  } catch (err) {
    if (err.message.includes("API_KEY")) return res.status(500).json({ error: err.message });
    return handleAxiosError(err, res);
  }
};