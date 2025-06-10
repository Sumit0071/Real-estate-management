package com.dreamhome.repository;

import com.dreamhome.entity.Inquiry;
import com.dreamhome.entity.InquiryStatus;
import com.dreamhome.entity.Property;
import com.dreamhome.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    
    List<Inquiry> findByUser(User user);
    
    List<Inquiry> findByProperty(Property property);
    
    List<Inquiry> findByStatus(InquiryStatus status);
    
    Page<Inquiry> findByUser(User user, Pageable pageable);
    
    Page<Inquiry> findByProperty(Property property, Pageable pageable);
    
    Page<Inquiry> findByStatus(InquiryStatus status, Pageable pageable);
    
    @Query("SELECT i FROM Inquiry i WHERE i.user = :user AND i.status = :status")
    List<Inquiry> findByUserAndStatus(@Param("user") User user, @Param("status") InquiryStatus status);
    
    @Query("SELECT i FROM Inquiry i WHERE i.property = :property AND i.status = :status")
    List<Inquiry> findByPropertyAndStatus(@Param("property") Property property, @Param("status") InquiryStatus status);
    
    @Query("SELECT COUNT(i) FROM Inquiry i WHERE i.status = :status")
    long countByStatus(@Param("status") InquiryStatus status);
    
    @Query("SELECT COUNT(i) FROM Inquiry i WHERE i.user = :user")
    long countByUser(@Param("user") User user);
}
