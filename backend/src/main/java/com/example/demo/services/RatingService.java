package com.example.demo.services;

import com.example.demo.entities.Rating;

import java.util.List;

public interface RatingService {
    Rating saveRating(Rating rating);
    Rating updateRating(Long id, Rating rating);
    void deleteRating(Long id);
    Rating getRating(Long id);
    List<Rating> getAllRatings();
} 