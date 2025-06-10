package com.dreamhome;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestAdminUser {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "koustav123";
        String encodedPassword = encoder.encode(rawPassword);
        
        System.out.println("Raw password: " + rawPassword);
        System.out.println("Encoded password: " + encodedPassword);
        System.out.println("Password matches: " + encoder.matches(rawPassword, encodedPassword));
        
        // Test with a known encoded password
        String testEncoded = "$2a$10$example";
        System.out.println("Test encoding works: " + encoder.matches("test", encoder.encode("test")));
    }
}
