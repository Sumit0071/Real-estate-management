package com.dreamhome.service;

import com.dreamhome.dto.PropertyDto;
import com.dreamhome.entity.Property;
import com.dreamhome.entity.PropertyStatus;
import com.dreamhome.entity.PropertyType;
import com.dreamhome.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {
    
    @Autowired
    private PropertyRepository propertyRepository;
    
    public List<PropertyDto> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Page<PropertyDto> getAvailableProperties(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Property> properties = propertyRepository.findByStatus(PropertyStatus.AVAILABLE, pageable);
        
        return properties.map(this::convertToDto);
    }
    
    public PropertyDto getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
        return convertToDto(property);
    }
    
    public List<PropertyDto> getFeaturedProperties() {
        return propertyRepository.findByIsFeaturedTrue().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Page<PropertyDto> searchProperties(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Property> properties = propertyRepository.searchProperties(keyword, pageable);
        return properties.map(this::convertToDto);
    }
    
    public Page<PropertyDto> filterProperties(
            BigDecimal minPrice, BigDecimal maxPrice, PropertyType type,
            Integer minBedrooms, Integer maxBedrooms, String city,
            int page, int size, String sortBy, String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Property> properties = propertyRepository.findPropertiesWithFilters(
            PropertyStatus.AVAILABLE, minPrice, maxPrice, type,
            minBedrooms, maxBedrooms, city, pageable
        );
        
        return properties.map(this::convertToDto);
    }
    
    public PropertyDto createProperty(PropertyDto propertyDto) {
        Property property = convertToEntity(propertyDto);
        property.setStatus(PropertyStatus.AVAILABLE);
        Property savedProperty = propertyRepository.save(property);
        return convertToDto(savedProperty);
    }
    
    public PropertyDto updateProperty(Long id, PropertyDto propertyDto) {
        Property existingProperty = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
        
        updatePropertyFromDto(existingProperty, propertyDto);
        Property updatedProperty = propertyRepository.save(existingProperty);
        return convertToDto(updatedProperty);
    }
    
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
        propertyRepository.delete(property);
    }
    
    public PropertyDto updatePropertyStatus(Long id, PropertyStatus status) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
        
        property.setStatus(status);
        Property updatedProperty = propertyRepository.save(property);
        return convertToDto(updatedProperty);
    }
    
    private PropertyDto convertToDto(Property property) {
        PropertyDto dto = new PropertyDto();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setPrice(property.getPrice());
        dto.setType(property.getType());
        dto.setStatus(property.getStatus());
        dto.setAddress(property.getAddress());
        dto.setCity(property.getCity());
        dto.setState(property.getState());
        dto.setZipCode(property.getZipCode());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setSquareFeet(property.getSquareFeet());
        dto.setLotSize(property.getLotSize());
        dto.setYearBuilt(property.getYearBuilt());
        dto.setImageUrls(property.getImageUrls());
        dto.setFeatures(property.getFeatures());
        dto.setIsFeatured(property.getIsFeatured());
        dto.setCreatedAt(property.getCreatedAt());
        dto.setUpdatedAt(property.getUpdatedAt());
        return dto;
    }
    
    private Property convertToEntity(PropertyDto dto) {
        Property property = new Property();
        updatePropertyFromDto(property, dto);
        return property;
    }
    
    private void updatePropertyFromDto(Property property, PropertyDto dto) {
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setPrice(dto.getPrice());
        property.setType(dto.getType());
        property.setAddress(dto.getAddress());
        property.setCity(dto.getCity());
        property.setState(dto.getState());
        property.setZipCode(dto.getZipCode());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setSquareFeet(dto.getSquareFeet());
        property.setLotSize(dto.getLotSize());
        property.setYearBuilt(dto.getYearBuilt());
        property.setImageUrls(dto.getImageUrls());
        property.setFeatures(dto.getFeatures());
        property.setIsFeatured(dto.getIsFeatured());
        if (dto.getStatus() != null) {
            property.setStatus(dto.getStatus());
        }
    }
}
