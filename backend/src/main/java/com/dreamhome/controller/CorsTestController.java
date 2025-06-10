package com.dreamhome.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Test controller to verify CORS configuration
 * This controller provides endpoints to test cross-origin requests
 */
@RestController
@RequestMapping("/cors-test")
public class CorsTestController {

    /**
     * Simple GET endpoint to test CORS
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> testCorsGet() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS GET request successful");
        response.put("timestamp", LocalDateTime.now());
        response.put("method", "GET");
        return ResponseEntity.ok(response);
    }

    /**
     * POST endpoint to test CORS with request body
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> testCorsPost(@RequestBody(required = false) Map<String, Object> requestBody) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS POST request successful");
        response.put("timestamp", LocalDateTime.now());
        response.put("method", "POST");
        response.put("receivedData", requestBody);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT endpoint to test CORS with request body
     */
    @PutMapping
    public ResponseEntity<Map<String, Object>> testCorsPut(@RequestBody(required = false) Map<String, Object> requestBody) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS PUT request successful");
        response.put("timestamp", LocalDateTime.now());
        response.put("method", "PUT");
        response.put("receivedData", requestBody);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE endpoint to test CORS
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> testCorsDelete(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS DELETE request successful");
        response.put("timestamp", LocalDateTime.now());
        response.put("method", "DELETE");
        response.put("deletedId", id);
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH endpoint to test CORS
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> testCorsPatch(@PathVariable String id, @RequestBody(required = false) Map<String, Object> requestBody) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS PATCH request successful");
        response.put("timestamp", LocalDateTime.now());
        response.put("method", "PATCH");
        response.put("patchedId", id);
        response.put("receivedData", requestBody);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint to test custom headers
     */
    @GetMapping("/headers")
    public ResponseEntity<Map<String, Object>> testCorsHeaders(@RequestHeader(value = "X-Custom-Header", required = false) String customHeader) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS headers test successful");
        response.put("timestamp", LocalDateTime.now());
        response.put("customHeader", customHeader);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint to test authentication with CORS
     */
    @GetMapping("/auth-test")
    public ResponseEntity<Map<String, Object>> testCorsWithAuth() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CORS with authentication test - this endpoint requires authentication");
        response.put("timestamp", LocalDateTime.now());
        response.put("note", "This endpoint should be accessible only with valid JWT token");
        return ResponseEntity.ok(response);
    }
}
