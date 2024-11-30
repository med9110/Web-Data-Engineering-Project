package com.example.demo.Repository;

import com.example.demo.entities.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    // Additional query methods can be defined here if needed
}