package com.dreamhome.dto;

import com.dreamhome.entity.PropertyStatus;
import com.dreamhome.entity.PropertyType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PropertyDto {
    
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private PropertyType type;
    private PropertyStatus status;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer squareFeet;
    private Double lotSize;
    private Integer yearBuilt;
    private List<String> imageUrls;
    private List<String> features;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public PropertyDto() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public PropertyType getType() { return type; }
    public void setType(PropertyType type) { this.type = type; }
    
    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    
    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }
    
    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }
    
    public Integer getSquareFeet() { return squareFeet; }
    public void setSquareFeet(Integer squareFeet) { this.squareFeet = squareFeet; }
    
    public Double getLotSize() { return lotSize; }
    public void setLotSize(Double lotSize) { this.lotSize = lotSize; }
    
    public Integer getYearBuilt() { return yearBuilt; }
    public void setYearBuilt(Integer yearBuilt) { this.yearBuilt = yearBuilt; }
    
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
    
    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
