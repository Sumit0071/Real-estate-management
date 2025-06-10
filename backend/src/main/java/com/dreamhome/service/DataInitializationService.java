package com.dreamhome.service;

import com.dreamhome.entity.*;
import com.dreamhome.repository.PropertyRepository;
import com.dreamhome.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Starting data initialization...");
            initializeUsers();
            initializeProperties();
            System.out.println("Data initialization completed successfully.");
        } catch (Exception e) {
            System.err.println("Error initializing data: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private void initializeUsers() {
        System.out.println("Initializing users...");

        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            System.out.println("Creating admin user...");
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@dreamhome.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            userRepository.save(admin);
            System.out.println("Admin user created: admin/admin123");
        } else {
            System.out.println("Admin user already exists");
        }

        // Create specific admin user 'koustav' if not exists
        if (!userRepository.existsByUsername("koustav")) {
            System.out.println("Creating koustav admin user...");
            User koustav = new User();
            koustav.setUsername("koustav");
            koustav.setEmail("koustav@dreamhome.com");
            String encodedPassword = passwordEncoder.encode("koustav123");
            koustav.setPassword(encodedPassword);
            koustav.setFirstName("Koustav");
            koustav.setLastName("Admin");
            koustav.setRole(Role.ADMIN);
            koustav.setIsActive(true);
            userRepository.save(koustav);
            System.out.println("Koustav admin user created: koustav/koustav123");
            System.out.println("Encoded password: " + encodedPassword);
        } else {
            System.out.println("Koustav admin user already exists");
        }

        // Create demo user if not exists
        if (!userRepository.existsByUsername("demo")) {
            User user = new User();
            user.setUsername("demo");
            user.setEmail("demo@dreamhome.com");
            user.setPassword(passwordEncoder.encode("demo123"));
            user.setFirstName("Demo");
            user.setLastName("User");
            user.setRole(Role.USER);
            user.setIsActive(true);
            userRepository.save(user);
            System.out.println("Demo user created: demo/demo123");
        }
    }

    private void initializeProperties() {
        if (propertyRepository.count() == 0) {
            // Create sample properties
            Property property1 = new Property();
            property1.setTitle("Beautiful Family Home");
            property1.setDescription("A stunning 4-bedroom family home with modern amenities and a large backyard.");
            property1.setPrice(new BigDecimal("450000"));
            property1.setType(PropertyType.HOUSE);
            property1.setStatus(PropertyStatus.AVAILABLE);
            property1.setAddress("123 Oak Street");
            property1.setCity("Springfield");
            property1.setState("IL");
            property1.setZipCode("62701");
            property1.setBedrooms(4);
            property1.setBathrooms(3);
            property1.setSquareFeet(2500);
            property1.setLotSize(0.5);
            property1.setYearBuilt(2015);
            property1.setIsFeatured(true);
            property1.setImageUrls(Arrays.asList(
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be"));
            property1.setFeatures(Arrays.asList("Garage", "Garden", "Modern Kitchen", "Fireplace"));

            Property property2 = new Property();
            property2.setTitle("Downtown Luxury Apartment");
            property2.setDescription("Modern luxury apartment in the heart of downtown with city views.");
            property2.setPrice(new BigDecimal("320000"));
            property2.setType(PropertyType.APARTMENT);
            property2.setStatus(PropertyStatus.AVAILABLE);
            property2.setAddress("456 Main Street");
            property2.setCity("Springfield");
            property2.setState("IL");
            property2.setZipCode("62702");
            property2.setBedrooms(2);
            property2.setBathrooms(2);
            property2.setSquareFeet(1200);
            property2.setYearBuilt(2020);
            property2.setIsFeatured(true);
            property2.setImageUrls(Arrays.asList(
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"));
            property2.setFeatures(Arrays.asList("City View", "Gym", "Pool", "Concierge"));

            Property property3 = new Property();
            property3.setTitle("Cozy Suburban Townhouse");
            property3.setDescription("Perfect starter home in a quiet suburban neighborhood.");
            property3.setPrice(new BigDecimal("275000"));
            property3.setType(PropertyType.TOWNHOUSE);
            property3.setStatus(PropertyStatus.AVAILABLE);
            property3.setAddress("789 Elm Avenue");
            property3.setCity("Springfield");
            property3.setState("IL");
            property3.setZipCode("62703");
            property3.setBedrooms(3);
            property3.setBathrooms(2);
            property3.setSquareFeet(1800);
            property3.setYearBuilt(2010);
            property3.setIsFeatured(false);
            property3.setImageUrls(Arrays.asList(
                    "https://images.unsplash.com/photo-1449844908441-8829872d2607"));
            property3.setFeatures(Arrays.asList("Patio", "Storage", "Quiet Neighborhood"));

            propertyRepository.saveAll(Arrays.asList(property1, property2, property3));
            System.out.println("Sample properties created");
        }
    }
}
