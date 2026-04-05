package com.weatherapp.backend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        // 100 requests per 15 minutes
        Bandwidth limit = Bandwidth.builder()
            .capacity(100)
            .refillIntervally(100, Duration.ofMinutes(15))
            .build();
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        if (httpRequest.getRequestURI().startsWith("/api")) {
            // Get IP Address (Considering basic setup here)
            String ip = httpRequest.getRemoteAddr();
            String forwardedFor = httpRequest.getHeader("X-Forwarded-For");
            if (forwardedFor != null && !forwardedFor.isEmpty()) {
                ip = forwardedFor.split(",")[0];
            }

            Bucket bucket = cache.computeIfAbsent(ip, k -> createNewBucket());

            if (bucket.tryConsume(1)) {
                // Add rate limit headers to let client know
                httpResponse.addHeader("X-RateLimit-Limit", "100");
                httpResponse.addHeader("X-RateLimit-Remaining", String.valueOf(bucket.getAvailableTokens()));
                chain.doFilter(request, response);
            } else {
                httpResponse.setStatus(429);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"error\": \"Too many requests, please try again later.\"}");
            }
        } else {
            chain.doFilter(request, response);
        }
    }
}
