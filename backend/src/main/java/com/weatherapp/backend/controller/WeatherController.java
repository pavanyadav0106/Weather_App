package com.weatherapp.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@RestController
public class WeatherController {

    private final RestTemplate restTemplate;

    @Value("${OPENWEATHER_API_KEY:}")
    private String apiKey;

    private static final String OWM_BASE = "https://api.openweathermap.org/data/2.5";

    public WeatherController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private String getApiKey() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new RuntimeException("API key not set");
        }
        return apiKey;
    }

    // Root route
    @GetMapping("/")
    public String root() {
        return "Weather API is running 🚀";
    }

    // Health check
    @GetMapping("/api/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        return response;
    }

    // CURRENT WEATHER
    @GetMapping("/api/weather/current")
    public ResponseEntity<?> getCurrentWeather(@RequestParam(value = "city", required = false) String city) {
        if (city == null || city.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "City is required");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(OWM_BASE + "/weather")
                    .queryParam("q", city)
                    .queryParam("appid", getApiKey())
                    .queryParam("units", "metric")
                    .toUriString();

            Map<?, ?> response = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch weather");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // LOCATION WEATHER
    @GetMapping("/api/weather/location")
    public ResponseEntity<?> getLocationWeather(
            @RequestParam(value = "lat", required = false) Double lat,
            @RequestParam(value = "lon", required = false) Double lon) {

        if (lat == null || lon == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "lat & lon required");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            String currentUrl = UriComponentsBuilder.fromHttpUrl(OWM_BASE + "/weather")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("appid", getApiKey())
                    .queryParam("units", "metric")
                    .toUriString();

            String forecastUrl = UriComponentsBuilder.fromHttpUrl(OWM_BASE + "/forecast")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("appid", getApiKey())
                    .queryParam("units", "metric")
                    .toUriString();

            Map<?, ?> current = restTemplate.getForObject(currentUrl, Map.class);
            Map<?, ?> forecast = restTemplate.getForObject(forecastUrl, Map.class);

            Map<String, Object> result = new HashMap<>();
            result.put("current", current);
            result.put("forecast", forecast);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch location weather");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
