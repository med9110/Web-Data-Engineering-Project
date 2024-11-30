package com.example.demo.Repository;

import com.example.demo.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    // Additional query methods can be defined here if needed
} 