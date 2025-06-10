package com.dreamhome.repository;

import com.dreamhome.entity.Property;
import com.dreamhome.entity.PropertyStatus;
import com.dreamhome.entity.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByStatus(PropertyStatus status);

    List<Property> findByType(PropertyType type);

    List<Property> findByIsFeaturedTrue();

    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.status = :status AND p.price BETWEEN :minPrice AND :maxPrice")
    Page<Property> findByStatusAndPriceBetween(
            @Param("status") PropertyStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.status = :status AND p.type = :type")
    Page<Property> findByStatusAndType(
            @Param("status") PropertyStatus status,
            @Param("type") PropertyType type,
            Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.status = :status AND " +
            "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
            "(:state IS NULL OR LOWER(p.state) LIKE LOWER(CONCAT('%', :state, '%')))")
    Page<Property> findByStatusAndLocation(
            @Param("status") PropertyStatus status,
            @Param("city") String city,
            @Param("state") String state,
            Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.status = :status AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:type IS NULL OR p.type = :type) AND " +
            "(:minBedrooms IS NULL OR p.bedrooms >= :minBedrooms) AND " +
            "(:maxBedrooms IS NULL OR p.bedrooms <= :maxBedrooms) AND " +
            "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))")
    Page<Property> findPropertiesWithFilters(
            @Param("status") PropertyStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("type") PropertyType type,
            @Param("minBedrooms") Integer minBedrooms,
            @Param("maxBedrooms") Integer maxBedrooms,
            @Param("city") String city,
            Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.status = 'AVAILABLE' AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.city) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Property> searchProperties(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = :status")
    long countByStatus(@Param("status") PropertyStatus status);

    long countByType(PropertyType type);

    List<Property> findTop5ByOrderByCreatedAtDesc();
}
