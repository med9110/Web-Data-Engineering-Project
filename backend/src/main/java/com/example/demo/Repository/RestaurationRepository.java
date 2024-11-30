package com.example.demo.Repository;

import com.example.demo.entities.Restauration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurationRepository extends JpaRepository<Restauration, Long> {
    // Additional query methods can be defined here if needed
}