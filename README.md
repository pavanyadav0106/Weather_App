# SkyCast — Advanced Weather Application

A full-stack weather dashboard built with **React + Vite** (frontend) and **Java + Spring Boot** (backend), powered by the **OpenWeatherMap API**.

---

## 📁 Project Structure

```
weather-app/
├── backend/                  # Java Spring Boot backend
│   ├── src/                  # Java source code
│   ├── pom.xml               # Maven configuration
│   ├── Dockerfile            # Docker image configuration
│   └── .env                  # API key & config (edit this!)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CurrentWeather.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── FavoritesPanel.jsx
│   │   │   ├── ForecastCard.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── TemperatureChart.jsx
│   │   │   └── WeatherDetails.jsx
│   │   ├── hooks/
│   │   │   ├── useFavorites.js
│   │   │   └── useWeather.js
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── weatherService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Quick Start

### 1. Get an OpenWeatherMap API Key (Free)

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to **API keys** in your profile
4. Copy your key (it activates within ~2 hours of account creation)

---

### 2. Configure the Backend

```bash
cd backend
```

Open `backend/.env` and ensure the API key is set:

```env
OPENWEATHER_API_KEY=your_actual_api_key_here
PORT=5000
```
### 3. Install & Run the Backend

**Option A: Run via Maven** (Requires Java 17+ and Maven)
```bash
cd backend
mvn spring-boot:run
```

**Option B: Run via Docker**
```bash
cd backend
docker build -t weather-backend .
docker run -p 5000:5000 --env-file .env weather-backend
# ✅ Weather API server running on http://localhost:5000
```

---

### 4. Install & Run the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
# ✅ Vite dev server: http://localhost:5173
```

Open your browser at **http://localhost:5173**

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/weather/current?city=London` | Current weather by city name |
| GET | `/api/weather/forecast?city=London` | 5-day forecast by city name |
| GET | `/api/weather/location?lat=51.5&lon=-0.12` | Current + forecast by GPS |

All endpoints return clean JSON. Error responses include an `error` string field.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🌡️ Current weather | Temperature, humidity, wind, pressure, visibility |
| 📅 5-day forecast | Daily min/max, precipitation chance, icon |
| 📈 Temperature chart | Area chart with hourly data via Recharts |
| 🌅 Sunrise / Sunset | Converted to local city time |
| 🔍 City search | Search any city worldwide |
| 📍 Geolocation | Auto-detect via browser GPS |
| ⭐ Favourites | Add/remove cities, persisted in localStorage |
| 💾 Session memory | Last-viewed city reloads on refresh |
| 🎨 Glassmorphism UI | Dynamic sky gradient + frosted-glass cards |
| 📱 Responsive | Works on mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| HTTP (FE) | Axios |
| Backend | Java 17 + Spring Boot 3 |
| HTTP (BE) | RestTemplate / HttpClient |
| Weather API | OpenWeatherMap (free tier) |
| State | React hooks (useState, useCallback) |
| Persistence | localStorage + sessionStorage |

---

## 🔒 Rate Limiting

The backend applies a rate limit of **100 requests per 15 minutes per IP** to protect your API quota.

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Invalid API key` | Check `backend/.env` — key must not be the placeholder |
| `City not found` | Try a different spelling or add a country code: `Paris,FR` |
| Blank page in browser | Ensure both backend (5000) and frontend (5173) are running |
| CORS error | Vite proxy handles this automatically — do not call port 5000 directly |
| API key not working | New keys can take up to 2 hours to activate on OWM |

---

## 📦 Building for Production

```bash
# Build the frontend
cd frontend
npm run build      # outputs to frontend/dist/

# Serve static files from Express (optional)
# Copy frontend/dist → backend/public and add:
# app.use(express.static(path.join(__dirname, 'public')));
```
