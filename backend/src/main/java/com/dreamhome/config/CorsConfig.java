package com.dreamhome.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods}")
    private String allowedMethods;

    @Value("${cors.allowed-headers}")
    private String allowedHeaders;

    @Value("${cors.exposed-headers:}")
    private String exposedHeaders;

    @Value("${cors.allow-credentials}")
    private boolean allowCredentials;

    @Value("${cors.max-age:3600}")
    private long maxAge;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Set allowed origins - support for environment-specific configuration
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOrigins(origins);

        // Alternative: Use setAllowedOriginPatterns for more flexible pattern matching
        // configuration.setAllowedOriginPatterns(origins);

        // Set allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList(allowedMethods.split(",")));

        // Set allowed headers - be more specific for security
        if ("*".equals(allowedHeaders.trim())) {
            // For development, allow all headers, but log a warning
            configuration.addAllowedHeader("*");
            System.out.println(
                    "WARNING: CORS is configured to allow all headers. Consider restricting this in production.");
        } else {
            configuration.setAllowedHeaders(Arrays.asList(allowedHeaders.split(",")));
        }

        // Set exposed headers if specified
        if (exposedHeaders != null && !exposedHeaders.trim().isEmpty()) {
            configuration.setExposedHeaders(Arrays.asList(exposedHeaders.split(",")));
        }

        // Set credentials support
        configuration.setAllowCredentials(allowCredentials);

        // Set max age for preflight requests (how long browsers can cache preflight
        // responses)
        configuration.setMaxAge(maxAge);

        // Apply CORS configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
