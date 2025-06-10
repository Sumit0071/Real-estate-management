package com.dreamhome.service;

import com.dreamhome.dto.*;
import com.dreamhome.entity.Role;
import com.dreamhome.entity.User;
import com.dreamhome.repository.UserRepository;
import com.dreamhome.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest loginRequest) {
        System.out.println("Login attempt for username: " + loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("Login successful for user: " + user.getUsername() + " with role: " + user.getRole());

            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("role", user.getRole().name());
            extraClaims.put("userId", user.getId());

            String token = jwtUtil.generateToken(userDetails, extraClaims);

            UserDto userDto = convertToUserDto(user);

            return new AuthResponse(token, userDto);
        } catch (Exception e) {
            System.err.println("Login failed for username: " + loginRequest.getUsername() + " - " + e.getMessage());
            throw e;
        }
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(Role.USER);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", savedUser.getRole().name());
        extraClaims.put("userId", savedUser.getId());

        String token = jwtUtil.generateToken(savedUser, extraClaims);

        UserDto userDto = convertToUserDto(savedUser);

        return new AuthResponse(token, userDto);
    }

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
