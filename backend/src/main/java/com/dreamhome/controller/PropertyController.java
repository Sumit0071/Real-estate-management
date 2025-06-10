package com.dreamhome.controller;

import com.dreamhome.dto.PropertyDto;
import com.dreamhome.entity.PropertyStatus;
import com.dreamhome.entity.PropertyType;
import com.dreamhome.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    // Public endpoints (no authentication required)
    @GetMapping("/public")
    public ResponseEntity<Page<PropertyDto>> getAvailableProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<PropertyDto> properties = propertyService.getAvailableProperties(page, size, sortBy, sortDir);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable Long id) {
        PropertyDto property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PropertyDto>> getFeaturedProperties() {
        List<PropertyDto> properties = propertyService.getFeaturedProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PropertyDto>> searchProperties(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<PropertyDto> properties = propertyService.searchProperties(keyword, page, size);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<PropertyDto>> filterProperties(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) PropertyType type,
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(required = false) Integer maxBedrooms,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<PropertyDto> properties = propertyService.filterProperties(
                minPrice, maxPrice, type, minBedrooms, maxBedrooms, city,
                page, size, sortBy, sortDir);
        return ResponseEntity.ok(properties);
    }

    // Admin endpoints (authentication required)
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PropertyDto>> getAllProperties() {
        List<PropertyDto> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PropertyDto> createProperty(@Valid @RequestBody PropertyDto propertyDto) {
        PropertyDto createdProperty = propertyService.createProperty(propertyDto);
        return ResponseEntity.ok(createdProperty);
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PropertyDto> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDto propertyDto) {
        PropertyDto updatedProperty = propertyService.updateProperty(id, propertyDto);
        return ResponseEntity.ok(updatedProperty);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PropertyDto> updatePropertyStatus(
            @PathVariable Long id,
            @RequestParam PropertyStatus status) {
        PropertyDto updatedProperty = propertyService.updatePropertyStatus(id, status);
        return ResponseEntity.ok(updatedProperty);
    }
}
