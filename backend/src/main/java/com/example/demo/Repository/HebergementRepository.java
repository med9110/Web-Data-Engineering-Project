package com.example.demo.Repository;

import com.example.demo.entities.Hebergement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HebergementRepository extends JpaRepository<Hebergement, Long> {
    // Additional query methods can be defined here if needed
}