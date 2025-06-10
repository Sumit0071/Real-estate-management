package com.dreamhome.controller;

import com.dreamhome.entity.Role;
import com.dreamhome.entity.User;
import com.dreamhome.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("totalUsers", users.size());
        response.put("users", users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());
            userMap.put("isActive", user.getIsActive());
            return userMap;
        }).toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-admin")
    public ResponseEntity<Map<String, Object>> checkAdmin() {
        Map<String, Object> response = new HashMap<>();
        
        // Check if koustav user exists
        boolean koustavExists = userRepository.existsByUsername("koustav");
        response.put("koustavExists", koustavExists);
        
        if (koustavExists) {
            User koustav = userRepository.findByUsername("koustav").orElse(null);
            if (koustav != null) {
                response.put("koustavRole", koustav.getRole());
                response.put("koustavActive", koustav.getIsActive());
                response.put("koustavEmail", koustav.getEmail());
                
                // Test password
                boolean passwordMatches = passwordEncoder.matches("koustav123", koustav.getPassword());
                response.put("passwordMatches", passwordMatches);
            }
        }
        
        // Check if admin user exists
        boolean adminExists = userRepository.existsByUsername("admin");
        response.put("adminExists", adminExists);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, Object>> createAdmin() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Delete existing koustav user if exists
            userRepository.findByUsername("koustav").ifPresent(userRepository::delete);
            
            // Create new koustav admin user
            User koustav = new User();
            koustav.setUsername("koustav");
            koustav.setEmail("koustav@dreamhome.com");
            koustav.setPassword(passwordEncoder.encode("koustav123"));
            koustav.setFirstName("Koustav");
            koustav.setLastName("Admin");
            koustav.setRole(Role.ADMIN);
            koustav.setIsActive(true);
            
            User savedUser = userRepository.save(koustav);
            
            response.put("success", true);
            response.put("message", "Admin user created successfully");
            response.put("userId", savedUser.getId());
            response.put("username", savedUser.getUsername());
            response.put("role", savedUser.getRole());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}
