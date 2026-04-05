package com.weatherapp.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WeatherService {

    public Map<String, Object> transformCurrent(JsonNode data) {
        Map<String, Object> current = new HashMap<>();
        current.put("city", data.path("name").asText());
        current.put("country", data.path("sys").path("country").asText(""));
        current.put("lat", data.path("coord").path("lat").asDouble());
        current.put("lon", data.path("coord").path("lon").asDouble());
        current.put("temperature", Math.round(data.path("main").path("temp").asDouble()));
        current.put("feelsLike", Math.round(data.path("main").path("feels_like").asDouble()));
        current.put("tempMin", Math.round(data.path("main").path("temp_min").asDouble()));
        current.put("tempMax", Math.round(data.path("main").path("temp_max").asDouble()));
        current.put("humidity", data.path("main").path("humidity").asInt());
        current.put("pressure", data.path("main").path("pressure").asInt());
        
        int visibility = data.path("visibility").asInt(0);
        current.put("visibility", Math.round(visibility / 1000.0));
        
        current.put("windSpeed", data.path("wind").path("speed").asDouble());
        current.put("windDeg", data.path("wind").path("deg").asInt());

        JsonNode weatherArray = data.path("weather");
        if (weatherArray.isArray() && !weatherArray.isEmpty()) {
            JsonNode weather = weatherArray.get(0);
            current.put("description", weather.path("description").asText());
            String icon = weather.path("icon").asText();
            current.put("icon", icon);
            current.put("iconUrl", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
        } else {
            current.put("description", "");
            current.put("icon", "");
            current.put("iconUrl", "");
        }

        current.put("sunrise", data.path("sys").path("sunrise").asLong());
        current.put("sunset", data.path("sys").path("sunset").asLong());
        current.put("timezone", data.path("timezone").asLong());
        current.put("dt", data.path("dt").asLong());
        
        return current;
    }

    public Map<String, Object> transformForecast(JsonNode data) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("city", data.path("city").path("name").asText());
        payload.put("country", data.path("city").path("country").asText());

        Map<String, List<Map<String, Object>>> byDay = new LinkedHashMap<>();
        
        JsonNode list = data.path("list");
        if (list.isArray()) {
            for (JsonNode item : list) {
                String dtTxt = item.path("dt_txt").asText();
                String day = dtTxt.split(" ")[0];
                
                Map<String, Object> slot = new HashMap<>();
                slot.put("dt", item.path("dt").asLong());
                slot.put("time", dtTxt);
                slot.put("temperature", Math.round(item.path("main").path("temp").asDouble()));
                slot.put("feelsLike", Math.round(item.path("main").path("feels_like").asDouble()));
                slot.put("tempMin", Math.round(item.path("main").path("temp_min").asDouble()));
                slot.put("tempMax", Math.round(item.path("main").path("temp_max").asDouble()));
                slot.put("humidity", item.path("main").path("humidity").asInt());
                slot.put("windSpeed", item.path("wind").path("speed").asDouble());
                
                JsonNode weatherArray = item.path("weather");
                if (weatherArray.isArray() && !weatherArray.isEmpty()) {
                    JsonNode weather = weatherArray.get(0);
                    slot.put("description", weather.path("description").asText());
                    String icon = weather.path("icon").asText();
                    slot.put("icon", icon);
                    slot.put("iconUrl", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
                }
                
                double pop = item.path("pop").asDouble(0.0);
                slot.put("pop", Math.round(pop * 100));
                
                byDay.computeIfAbsent(day, k -> new ArrayList<>()).add(slot);
            }
        }
        
        List<Map<String, Object>> daysList = new ArrayList<>();
        int count = 0;
        
        for (Map.Entry<String, List<Map<String, Object>>> entry : byDay.entrySet()) {
            if (count >= 5) break; 
            count++;
            
            String date = entry.getKey();
            List<Map<String, Object>> slots = entry.getValue();
            
            long minTemp = Long.MAX_VALUE;
            long maxTemp = Long.MIN_VALUE;
            long maxPop = 0;
            
            for (Map<String, Object> slot : slots) {
                long temp = ((Number) slot.get("temperature")).longValue();
                if (temp < minTemp) minTemp = temp;
                if (temp > maxTemp) maxTemp = temp;
                
                long pop = ((Number) slot.get("pop")).longValue();
                if (pop > maxPop) maxPop = pop;
            }
            
            Map<String, Object> midSlot = slots.get(slots.size() / 2);
            
            Map<String, Object> daySummary = new HashMap<>();
            daySummary.put("date", date);
            daySummary.put("tempMin", minTemp);
            daySummary.put("tempMax", maxTemp);
            daySummary.put("description", midSlot.get("description"));
            daySummary.put("icon", midSlot.get("icon"));
            daySummary.put("iconUrl", midSlot.get("iconUrl"));
            daySummary.put("humidity", midSlot.get("humidity"));
            daySummary.put("windSpeed", midSlot.get("windSpeed"));
            daySummary.put("pop", maxPop);
            daySummary.put("hourly", slots);
            
            daysList.add(daySummary);
        }
        
        payload.put("days", daysList);
        return payload;
    }
}
