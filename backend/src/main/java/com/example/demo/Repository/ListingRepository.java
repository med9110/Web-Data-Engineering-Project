package com.example.demo.Repository;

import com.example.demo.entities.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    // Additional query methods can be defined here if needed
} 