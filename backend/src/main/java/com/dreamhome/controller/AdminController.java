package com.dreamhome.controller;

import com.dreamhome.dto.UserDto;
import com.dreamhome.entity.User;
import com.dreamhome.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStatistics();
        return ResponseEntity.ok(stats);
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Page<UserDto> users = adminService.getAllUsers(page, size, sortBy, sortDir);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody User user) {
        UserDto createdUser = adminService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        UserDto updatedUser = adminService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<UserDto> activateUser(@PathVariable Long id) {
        UserDto user = adminService.toggleUserStatus(id, true);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<UserDto> deactivateUser(@PathVariable Long id) {
        UserDto user = adminService.toggleUserStatus(id, false);
        return ResponseEntity.ok(user);
    }

    // User Search
    @GetMapping("/users/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam String query) {
        List<UserDto> users = adminService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    // Property Statistics
    @GetMapping("/properties/stats")
    public ResponseEntity<Map<String, Object>> getPropertyStats() {
        Map<String, Object> stats = adminService.getPropertyStatistics();
        return ResponseEntity.ok(stats);
    }

    // Inquiry Management
    @GetMapping("/inquiries")
    public ResponseEntity<Page<Map<String, Object>>> getAllInquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Map<String, Object>> inquiries = adminService.getAllInquiries(page, size);
        return ResponseEntity.ok(inquiries);
    }

    @PutMapping("/inquiries/{id}/respond")
    public ResponseEntity<?> respondToInquiry(
            @PathVariable Long id,
            @RequestBody Map<String, String> response) {
        adminService.respondToInquiry(id, response.get("response"));
        return ResponseEntity.ok().build();
    }

    // System Information
    @GetMapping("/system/info")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        Map<String, Object> systemInfo = adminService.getSystemInformation();
        return ResponseEntity.ok(systemInfo);
    }
}
