package com.dreamhome.service;

import com.dreamhome.dto.UserDto;
import com.dreamhome.entity.*;
import com.dreamhome.repository.InquiryRepository;
import com.dreamhome.repository.PropertyRepository;
import com.dreamhome.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Dashboard Statistics
    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActiveTrue();
        long adminUsers = userRepository.countByRole(Role.ADMIN);
        
        // Property statistics
        long totalProperties = propertyRepository.count();
        long availableProperties = propertyRepository.countByStatus(PropertyStatus.AVAILABLE);
        long soldProperties = propertyRepository.countByStatus(PropertyStatus.SOLD);
        
        // Inquiry statistics
        long totalInquiries = inquiryRepository.count();
        long pendingInquiries = inquiryRepository.countByStatus(InquiryStatus.PENDING);
        
        // Recent activity
        List<User> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc();
        List<Property> recentProperties = propertyRepository.findTop5ByOrderByCreatedAtDesc();
        
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("adminUsers", adminUsers);
        stats.put("totalProperties", totalProperties);
        stats.put("availableProperties", availableProperties);
        stats.put("soldProperties", soldProperties);
        stats.put("totalInquiries", totalInquiries);
        stats.put("pendingInquiries", pendingInquiries);
        stats.put("recentUsers", recentUsers.stream().map(this::convertToUserDto).collect(Collectors.toList()));
        stats.put("recentProperties", recentProperties);
        
        return stats;
    }

    // User Management
    public Page<UserDto> getAllUsers(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::convertToUserDto);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToUserDto(user);
    }

    public UserDto createUser(User user) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIsActive(true);
        
        User savedUser = userRepository.save(user);
        return convertToUserDto(savedUser);
    }

    public UserDto updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Check if username or email already exists for other users
        if (!user.getUsername().equals(userDetails.getUsername()) && 
            userRepository.existsByUsername(userDetails.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setRole(userDetails.getRole());
        
        // Only update password if provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        return convertToUserDto(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public UserDto toggleUserStatus(Long id, boolean isActive) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setIsActive(isActive);
        User updatedUser = userRepository.save(user);
        return convertToUserDto(updatedUser);
    }

    public List<UserDto> searchUsers(String query) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            query, query, query, query);
        return users.stream().map(this::convertToUserDto).collect(Collectors.toList());
    }

    // Property Statistics
    public Map<String, Object> getPropertyStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalProperties = propertyRepository.count();
        Map<PropertyStatus, Long> statusCounts = Arrays.stream(PropertyStatus.values())
            .collect(Collectors.toMap(
                status -> status,
                status -> propertyRepository.countByStatus(status)
            ));
        
        Map<PropertyType, Long> typeCounts = Arrays.stream(PropertyType.values())
            .collect(Collectors.toMap(
                type -> type,
                type -> propertyRepository.countByType(type)
            ));
        
        stats.put("totalProperties", totalProperties);
        stats.put("statusCounts", statusCounts);
        stats.put("typeCounts", typeCounts);
        
        return stats;
    }

    // Inquiry Management
    public Page<Map<String, Object>> getAllInquiries(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Inquiry> inquiries = inquiryRepository.findAll(pageable);
        
        return inquiries.map(inquiry -> {
            Map<String, Object> inquiryMap = new HashMap<>();
            inquiryMap.put("id", inquiry.getId());
            inquiryMap.put("message", inquiry.getMessage());
            inquiryMap.put("status", inquiry.getStatus());
            inquiryMap.put("adminResponse", inquiry.getAdminResponse());
            inquiryMap.put("createdAt", inquiry.getCreatedAt());
            inquiryMap.put("updatedAt", inquiry.getUpdatedAt());
            inquiryMap.put("user", convertToUserDto(inquiry.getUser()));
            inquiryMap.put("property", inquiry.getProperty());
            return inquiryMap;
        });
    }

    public void respondToInquiry(Long inquiryId, String response) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
            .orElseThrow(() -> new RuntimeException("Inquiry not found with id: " + inquiryId));
        
        inquiry.setAdminResponse(response);
        inquiry.setStatus(InquiryStatus.RESPONDED);
        inquiryRepository.save(inquiry);
    }

    // System Information
    public Map<String, Object> getSystemInformation() {
        Map<String, Object> systemInfo = new HashMap<>();
        
        systemInfo.put("serverTime", LocalDateTime.now());
        systemInfo.put("totalUsers", userRepository.count());
        systemInfo.put("totalProperties", propertyRepository.count());
        systemInfo.put("totalInquiries", inquiryRepository.count());
        systemInfo.put("version", "1.0.0");
        
        return systemInfo;
    }

    // Helper method to convert User to UserDto
    private UserDto convertToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setRole(user.getRole());
        userDto.setIsActive(user.getIsActive());
        userDto.setCreatedAt(user.getCreatedAt());
        return userDto;
    }
}
