package com.example.demo.Repository;

import com.example.demo.entities.Visited;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitedRepository extends JpaRepository<Visited, Long> {
    // Additional query methods can be defined here if needed
} 