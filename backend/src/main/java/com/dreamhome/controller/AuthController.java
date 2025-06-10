package com.dreamhome.controller;

import com.dreamhome.dto.AuthResponse;
import com.dreamhome.dto.LoginRequest;
import com.dreamhome.dto.RegisterRequest;
import com.dreamhome.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.login(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new SimpleErrorResponse("Login failed", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse authResponse = authService.register(registerRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new SimpleErrorResponse("Registration failed", e.getMessage()));
        }
    }

    // Inner class for simple error responses
    public static class SimpleErrorResponse {
        private String error;
        private String message;

        public SimpleErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
