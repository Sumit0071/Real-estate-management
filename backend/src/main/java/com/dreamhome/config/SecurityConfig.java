package com.dreamhome.config;

import com.dreamhome.security.JwtAuthenticationEntryPoint;
import com.dreamhome.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // Configure CORS using our custom configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                // Disable CSRF for REST API
                .csrf(csrf -> csrf.disable())

                // Configure exception handling
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint))

                // Configure session management
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configure authorization rules
                .authorizeHttpRequests(authz -> authz
                        // Public endpoints - no authentication required
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/properties/public/**").permitAll()
                        .requestMatchers("/properties/search").permitAll()
                        .requestMatchers("/properties/{id}").permitAll()
                        .requestMatchers("/cors-test").permitAll() // Test endpoint for CORS
                        .requestMatchers("/test/**").permitAll() // Test endpoints

                        // Admin endpoints - require ADMIN role
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // User endpoints - require USER or ADMIN role
                        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")

                        // All other requests require authentication
                        .anyRequest().authenticated())

                // Add authentication provider
                .authenticationProvider(authenticationProvider())

                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }
}
