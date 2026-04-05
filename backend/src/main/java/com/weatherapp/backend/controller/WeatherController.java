package com.weatherapp.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.weatherapp.backend.service.WeatherService;
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
    private final WeatherService weatherService;

    @Value("${OPENWEATHER_API_KEY:}")
    private String apiKey;

    private static final String OWM_BASE = "https://api.openweathermap.org/data/2.5";

    public WeatherController(RestTemplate restTemplate, WeatherService weatherService) {
        this.restTemplate = restTemplate;
        this.weatherService = weatherService;
    }

    private String getApiKey() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new RuntimeException("API key not set");
        }
        return apiKey;
    }

    @GetMapping("/")
    public String root() {
        return "Weather API is running 🚀";
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        return response;
    }

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

            JsonNode rawResponse = restTemplate.getForObject(url, JsonNode.class);
            Map<String, Object> finalPayload = weatherService.transformCurrent(rawResponse);
            return ResponseEntity.ok(finalPayload);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch weather");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

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

            JsonNode currentRaw = restTemplate.getForObject(currentUrl, JsonNode.class);
            JsonNode forecastRaw = restTemplate.getForObject(forecastUrl, JsonNode.class);

            Map<String, Object> currentFormat = weatherService.transformCurrent(currentRaw);
            Map<String, Object> forecastFormat = weatherService.transformForecast(forecastRaw);

            Map<String, Object> result = new HashMap<>();
            result.put("current", currentFormat);
            result.put("forecast", forecastFormat);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch location weather");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ── MISSING ENDPOINT: /api/weather/forecast ──────────────────────────────
    @GetMapping("/api/weather/forecast")
    public ResponseEntity<?> getForecast(@RequestParam(value = "city", required = false) String city) {
        if (city == null || city.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "City is required");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(OWM_BASE + "/forecast")
                    .queryParam("q", city)
                    .queryParam("appid", getApiKey())
                    .queryParam("units", "metric")
                    .toUriString();

            JsonNode rawResponse = restTemplate.getForObject(url, JsonNode.class);
            Map<String, Object> finalPayload = weatherService.transformForecast(rawResponse);
            return ResponseEntity.ok(finalPayload);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch forecast");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
